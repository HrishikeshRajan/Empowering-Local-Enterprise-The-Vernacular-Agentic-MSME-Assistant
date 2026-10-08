import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { store } from '../data/store.js';
import { CONFIDENCE_THRESHOLD_REVIEW } from '@msme/shared';
import { reflectionEngine } from '../agent/reflectionEngine.js';
import { 
  translateSpeechToEnglish, 
  isSarvamConfigured, 
  SarvamApiError, 
  SarvamConfigError 
} from './sarvamStt.js';

export const voiceRouter = Router();

// Multer memory storage for incoming voice notes / audio files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

/**
 * GET /api/voice/status
 * Return current voice STT provider configuration and health
 */
voiceRouter.get('/status', (_req: Request, res: Response) => {
  const configured = isSarvamConfigured();
  return res.status(200).json({
    sarvamConfigured: configured,
    engine: 'Sarvam AI (saaras:v2.5 speech-to-text-translate)',
    endpoint: 'https://api.sarvam.ai/speech-to-text-translate',
    docUrl: 'https://docs.sarvam.ai/api-reference/legacy/speech-to-text-translate/translate',
    supportedLanguages: ['ml-IN', 'hi-IN', 'ta-IN', 'te-IN', 'kn-IN', 'en-IN']
  });
});

/**
 * GET /api/voice/presets
 * Return vernacular voice presets (Malayalam & English)
 */
voiceRouter.get('/presets', (_req: Request, res: Response) => {
  const presets = store.getVoicePresets();
  return res.status(200).json(presets);
});

/**
 * POST /api/voice/transcribe
 * Transcribe incoming audio note or simulated voice buffer
 * Primary engine: Sarvam AI Speech-to-Text Translate (https://docs.sarvam.ai/api-reference/legacy/speech-to-text-translate/translate)
 * Automatically detects Malayalam/Indic speech and translates directly to English.
 */
voiceRouter.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const { presetId, rawText, rawTextMl, language = 'ml', autoExecute = 'true' } = req.body;

    let transcript = '';
    let transcriptMl = rawTextMl || '';
    let confidence = 96.5;
    let durationSeconds = 4.2;
    let detectedLanguage = language;
    let engine = 'Sarvam AI (saaras:v2.5 speech-to-text-translate)';
    let requestId: string | null = null;

    if (req.file) {
      // Audio file received via multipart form-data
      durationSeconds = Math.max(1, Math.round((req.file.size / 32000) * 10) / 10);

      if (!isSarvamConfigured()) {
        console.warn('[VoiceRouter] SARVAM_API_KEY is not configured, falling back to mock voice preset');
        const fallbackPreset = store.getVoicePresets()[0];
        transcript = fallbackPreset.englishTranslation;
        transcriptMl = fallbackPreset.malayalamAudioText;
        confidence = fallbackPreset.confidence;
        engine = 'Mock Vernacular Engine (SARVAM_API_KEY missing)';
      } else {
        try {
          console.log(`[VoiceRouter] Dispatching audio (${req.file.size} bytes, ${req.file.mimetype || 'unspecified'}) to Sarvam STT Translate`);
          const sarvamResult = await translateSpeechToEnglish(
            req.file.buffer,
            req.file.originalname || 'voice-note.webm',
            req.file.mimetype || 'audio/webm',
            {
              prompt: req.body.prompt || 'MSME grocery store inventory stock and billing in Kerala. Spoken in Malayalam or Manglish.'
            }
          );

          transcript = sarvamResult.transcript;
          detectedLanguage = sarvamResult.languageCode || 'ml-IN';
          confidence = sarvamResult.languageProbability != null
            ? Math.round(sarvamResult.languageProbability * 1000) / 10
            : 96.5;
          requestId = sarvamResult.requestId;
          engine = 'Sarvam AI (saaras:v2.5 speech-to-text-translate)';

          if (!transcript.trim()) {
            return res.status(200).json({
              transcription: {
                success: false,
                engine,
                language: detectedLanguage,
                transcript: '',
                transcriptMl: '',
                confidence: 0,
                durationSeconds,
                requestId,
                needsReview: true,
                reviewReason: 'No speech was detected in the audio clip. Please speak closer to the microphone and try again.'
              }
            });
          }
        } catch (sarvamError: any) {
          console.error('[VoiceRouter] Sarvam STT translation error:', sarvamError);
          return res.status(sarvamError.status || 502).json({
            error: sarvamError.message || 'Sarvam speech-to-text-translate failed',
            details: sarvamError
          });
        }
      }
    } else if (presetId) {
      const preset = store.getVoicePresets().find(p => p.id === presetId);
      if (preset) {
        transcript = preset.englishTranslation;
        transcriptMl = preset.malayalamAudioText;
        confidence = preset.confidence;
        engine = 'Preset Simulator';
      } else {
        return res.status(404).json({ error: `Preset with id ${presetId} not found` });
      }
    } else if (rawText) {
      transcript = rawText;
      transcriptMl = rawTextMl || rawText;
      confidence = 94.0;
      engine = 'Raw Text Input';
    } else {
      return res.status(400).json({ error: 'Audio file (audio), presetId, or rawText is required.' });
    }

    const needsReview = confidence < CONFIDENCE_THRESHOLD_REVIEW;

    const transcriptionResult = {
      success: true,
      engine,
      language: detectedLanguage,
      transcript,
      transcriptMl: transcriptMl || transcript,
      confidence,
      durationSeconds,
      requestId,
      needsReview,
      reviewReason: needsReview ? `Confidence ${confidence}% is below threshold (${CONFIDENCE_THRESHOLD_REVIEW}%)` : null
    };

    // If autoExecute requested, automatically pipe through Reflection Engine
    if (autoExecute === 'true' || autoExecute === true) {
      const agentResult = await reflectionEngine.executeWithReflection({
        inputPrompt: transcript,
        inputPromptMl: transcriptMl || transcript,
        inputType: 'voice',
        language: (detectedLanguage?.startsWith('ml') ? 'ml' : 'en') as any
      });

      return res.status(200).json({
        transcription: transcriptionResult,
        agentExecution: agentResult
      });
    }

    return res.status(200).json({ transcription: transcriptionResult });
  } catch (error: any) {
    console.error('[VoiceRouter] Transcription route error:', error);
    return res.status(500).json({ error: error.message || 'Voice transcription failed' });
  }
});

