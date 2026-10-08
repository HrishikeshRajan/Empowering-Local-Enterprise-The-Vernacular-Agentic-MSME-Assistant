/**
 * Sarvam AI — Speech to Text Translate provider
 *
 * Strategy implementation behind the STT provider interface.
 * Endpoint: POST https://api.sarvam.ai/speech-to-text-translate
 * Docs: https://docs.sarvam.ai/api-reference/legacy/speech-to-text-translate/translate
 *
 * Automatically detects the spoken Indic language, transcribes it, and translates
 * the text to English. Used as the primary vernacular voice engine, with the
 * self-hosted whisper.cpp pipeline (see voiceRouter) as fallback.
 */

const SARVAM_ENDPOINT = 'https://api.sarvam.ai/speech-to-text-translate';
const DEFAULT_MODEL = 'saaras:v2.5';
const DEFAULT_TIMEOUT_MS = 30_000;

export interface SarvamTranslateResult {
  /** English translation of the spoken audio */
  transcript: string;
  /** BCP-47 code of the predominant spoken language, e.g. "ml-IN" */
  languageCode: string | null;
  /** Confidence (0–1) that the detected language is correct */
  languageProbability: number | null;
  /** Provider request id, useful for support / tracing */
  requestId: string | null;
}

export interface SarvamTranslateOptions {
  /** Override API key (defaults to process.env.SARVAM_API_KEY) */
  apiKey?: string;
  /** Optional conversation context to boost accuracy */
  prompt?: string;
  /** Model id — saaras:v2.5 (default) translates Indic speech → English */
  model?: string;
  /** Audio codec, required only for raw PCM input */
  inputAudioCodec?: string;
  /** Injectable fetch implementation (testability / DI) */
  fetchImpl?: typeof fetch;
  /** Abort timeout in milliseconds */
  timeoutMs?: number;
}

export class SarvamConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SarvamConfigError';
  }
}

export class SarvamApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'SarvamApiError';
    this.status = status;
  }
}

/**
 * Resolve the Sarvam subscription key.
 * Accepts both SARVAM_API_KEY (canonical) and the legacy SARVAM_AI variable
 * already present in this repository's .env files.
 */
export function getSarvamApiKey(explicit?: string): string {
  const key = explicit
    || process.env.SARVAM_API_KEY
    || process.env.SARVAM_AI
    || '';
  return key.trim();
}

export function isSarvamConfigured(explicit?: string): boolean {
  const key = getSarvamApiKey(explicit);
  return key.length > 0 && !key.toLowerCase().includes('your_');
}

/**
 * Normalize browser MediaRecorder MIME types (e.g., 'audio/webm;codecs=opus')
 * to Sarvam API's strictly validated list of supported audio MIME types.
 */
export function normalizeSarvamMimeType(rawMime: string, filename = ''): string {
  const baseMime = (rawMime || '').split(';')[0].trim().toLowerCase();

  const ALLOWED_MIME_TYPES = new Set([
    'audio/mpeg', 'audio/mp3', 'audio/mpeg3', 'audio/x-mpeg-3', 'audio/x-mp3',
    'audio/wav', 'audio/x-wav', 'audio/wave',
    'audio/pcm_s16le', 'audio/l16', 'audio/raw', 'application/octet-stream',
    'audio/aac', 'audio/x-aac',
    'audio/aiff', 'audio/x-aiff',
    'audio/ogg', 'audio/vorbis', 'audio/opus',
    'audio/flac', 'audio/x-flac',
    'audio/mp4', 'audio/m4a',
    'audio/amr', 'audio/amr-wb', 'audio/amr-nb',
    'audio/wma', 'audio/x-ms-wma',
    'video/webm', 'audio/webm',
    'video/mp4'
  ]);

  if (ALLOWED_MIME_TYPES.has(baseMime)) {
    return baseMime;
  }

  const lowerFile = filename.toLowerCase();
  if (lowerFile.endsWith('.wav')) return 'audio/wav';
  if (lowerFile.endsWith('.mp3')) return 'audio/mp3';
  if (lowerFile.endsWith('.ogg') || lowerFile.endsWith('.opus')) return 'audio/ogg';
  if (lowerFile.endsWith('.m4a') || lowerFile.endsWith('.mp4')) return 'audio/mp4';
  if (lowerFile.endsWith('.webm')) return 'audio/webm';
  if (lowerFile.endsWith('.flac')) return 'audio/flac';
  if (lowerFile.endsWith('.aac')) return 'audio/aac';

  return 'audio/webm';
}

/**
 * Transcribe + translate a vernacular audio clip to English via Sarvam AI.
 * Endpoint: POST https://api.sarvam.ai/speech-to-text-translate
 * Pure I/O boundary: all external dependencies are injectable.
 */
export async function translateSpeechToEnglish(
  audio: Buffer,
  filename: string,
  mimeType: string,
  options: SarvamTranslateOptions = {}
): Promise<SarvamTranslateResult> {
  const apiKey = getSarvamApiKey(options.apiKey);
  if (!apiKey) {
    throw new SarvamConfigError(
      'SARVAM_API_KEY is not configured. Add it to backend/.env to enable Sarvam speech translation.'
    );
  }

  const cleanMime = normalizeSarvamMimeType(mimeType, filename);
  const cleanFilename = filename || `audio.${cleanMime.includes('wav') ? 'wav' : 'webm'}`;
  const fetchImpl = options.fetchImpl || fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(audio)], { type: cleanMime }), cleanFilename);
    form.append('model', options.model || DEFAULT_MODEL);
    if (options.prompt) form.append('prompt', options.prompt);
    if (options.inputAudioCodec) form.append('input_audio_codec', options.inputAudioCodec);

    console.log(`[Sarvam STT] Calling ${SARVAM_ENDPOINT} (${audio.length} bytes, format: ${cleanMime}, model: ${options.model || DEFAULT_MODEL})`);

    const res = await fetchImpl(SARVAM_ENDPOINT, {
      method: 'POST',
      headers: { 'api-subscription-key': apiKey },
      body: form,
      signal: controller.signal
    });

    if (!res.ok) {
      let errorDetail = '';
      try {
        const errorJson: any = await res.json();
        if (errorJson?.error?.message) {
          errorDetail = `${errorJson.error.message} (code: ${errorJson.error.code || 'UNKNOWN'})`;
        } else if (errorJson?.message) {
          errorDetail = String(errorJson.message);
        }
      } catch {
        const text = await res.text().catch(() => '');
        errorDetail = text ? text.slice(0, 300) : '';
      }

      throw new SarvamApiError(
        res.status,
        `Sarvam speech-to-text-translate failed with HTTP ${res.status}${errorDetail ? `: ${errorDetail}` : ''}`
      );
    }

    const data: any = await res.json();

    const result: SarvamTranslateResult = {
      transcript: String(data?.transcript ?? '').trim(),
      languageCode: data?.language_code ?? null,
      languageProbability: typeof data?.language_probability === 'number' ? data.language_probability : null,
      requestId: data?.request_id ?? null
    };

    console.log(`[Sarvam STT] Translated audio -> "${result.transcript}" (Lang: ${result.languageCode}, Confidence: ${result.languageProbability ?? 'N/A'}, Request ID: ${result.requestId})`);

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

