import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Sarvam AI accepts WAV, MP3, AAC, AIFF, OGG, OPUS, FLAC, MP4/M4A, AMR, WMA,
 * WebM and PCM. We probe the browser's MediaRecorder for the best supported
 * container so the uploaded blob is always a format the API can decode.
 */
const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav'
];

export interface RecordedAudio {
  blob: Blob;
  /** Original filename sent to the API — extension matters for format detection */
  filename: string;
  durationSeconds: number;
}

export interface UseAudioRecorderResult {
  isRecording: boolean;
  /** True once the mic stream is open and capturing audio */
  isCapturing: boolean;
  error: string | null;
  elapsedSeconds: number;
  /** True when the browser supports MediaRecorder + getUserMedia */
  isSupported: boolean;
  start: () => Promise<void>;
  /** Stops the recorder and resolves with the captured clip */
  stop: () => Promise<RecordedAudio | null>;
  cancel: () => void;
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  if (typeof MediaRecorder.isTypeSupported !== 'function') return undefined;
  return PREFERRED_MIME_TYPES.find(t => MediaRecorder.isTypeSupported(t));
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

/**
 * Records microphone audio for vernacular Speech-to-Text.
 *
 * Replaces the browser Web Speech API (which routes audio to Google's servers
 * and has unreliable Malayalam support) with a real MediaRecorder capture that
 * is uploaded to our backend and translated by Sarvam AI.
 *
 * All external dependencies (navigator.mediaDevices, MediaRecorder, timers) are
 * browser globals guarded behind support checks so the hook degrades cleanly.
 */
export function useAudioRecorder(): UseAudioRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveStopRef = useRef<((audio: RecordedAudio | null) => void) | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');

  const isSupported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    resolveStopRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch { }
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    releaseStream();
    setIsRecording(false);
    setIsCapturing(false);
    setElapsedSeconds(0);
  }, [releaseStream]);

  // Always release the microphone when the component unmounts
  useEffect(() => () => cancel(), [cancel]);

  const start = useCallback(async () => {
    setError(null);

    if (!isSupported) {
      setError('unsupported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
      });

      streamRef.current = stream;
      chunksRef.current = [];
      mimeTypeRef.current = pickMimeType() || 'audio/webm';

      const recorder = new MediaRecorder(stream, {
        ...(pickMimeType() ? { mimeType: mimeTypeRef.current } : {})
      });

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const durationSeconds =
          startedAtRef.current > 0
            ? Math.max(0.5, Math.round((Date.now() - startedAtRef.current) / 100) / 10)
            : 0;

        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        const resolve = resolveStopRef.current;
        resolveStopRef.current = null;

        clearTimer();
        releaseStream();
        setIsRecording(false);
        setIsCapturing(false);
        setElapsedSeconds(0);

        if (!blob.size) {
          resolve?.(null);
          return;
        }

        resolve?.({
          blob,
          filename: `kada-voice-note.${extensionFor(mimeTypeRef.current)}`,
          durationSeconds
        });
      };

      mediaRecorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start(250); // emit chunks continuously so nothing is lost

      setIsRecording(true);
      setIsCapturing(true);
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((Date.now() - startedAtRef.current) / 1000));
      }, 250);
    } catch (err: any) {
      const name = err?.name || '';
      setError(name === 'NotAllowedError' || name === 'SecurityError' ? 'permission' : 'capture');
      releaseStream();
      setIsRecording(false);
      setIsCapturing(false);
    }
  }, [isSupported, releaseStream]);

  const stop = useCallback((): Promise<RecordedAudio | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return Promise.resolve(null);
    }

    return new Promise<RecordedAudio | null>(resolve => {
      resolveStopRef.current = resolve;
      try {
        recorder.stop();
      } catch {
        resolveStopRef.current = null;
        resolve(null);
      }
    });
  }, []);

  return {
    isRecording,
    isCapturing,
    error,
    elapsedSeconds,
    isSupported,
    start,
    stop,
    cancel
  };
}
