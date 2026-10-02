import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { store } from '../data/store.js';
import { CONFIDENCE_THRESHOLD_REVIEW } from '@msme/shared';
import { reflectionEngine } from '../agent/reflectionEngine.js';

export const voiceRouter = Router();

// Multer memory storage for incoming voice notes / audio files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
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
 * Simulates whisper.cpp pipeline with confidence scoring and fallback
 */
voiceRouter.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const { presetId, rawText, language = 'ml', autoExecute = 'true' } = req.body;

    let transcript = '';
    let transcriptMl = '';
    let confidence = 96.5;
    let durationSeconds = 4.2;

    if (presetId) {
      const preset = store.getVoicePresets().find(p => p.id === presetId);
      if (preset) {
        transcript = preset.englishTranslation;
        transcriptMl = preset.malayalamAudioText;
        confidence = preset.confidence;
      }
    } else if (rawText) {
      transcript = rawText;
      transcriptMl = rawText;
      confidence = 94.0;
    } else if (req.file) {
      // Audio file received
      durationSeconds = Math.max(2, Math.round((req.file.size / 32000) * 10) / 10);
      transcript = 'Add 15 kg of tomato to stock at ₹40/kg';
      transcriptMl = 'രാവിലെ വന്ന തക്കാളി 15 കിലോ കൂടി സ്റ്റോക്കിൽ ചേർക്കൂ, വില കിലോയ്ക്ക് 40 രൂപ.';
      confidence = 96.8;
    } else {
      return res.status(400).json({ error: 'Audio file, presetId, or rawText is required.' });
    }

    const needsReview = confidence < CONFIDENCE_THRESHOLD_REVIEW;

    const transcriptionResult = {
      success: true,
      engine: 'whisper.cpp (base-v3-indic)',
      language,
      transcript,
      transcriptMl,
      confidence,
      durationSeconds,
      needsReview,
      reviewReason: needsReview ? `Confidence ${confidence}% is below threshold (${CONFIDENCE_THRESHOLD_REVIEW}%)` : null
    };

    // If autoExecute requested, automatically pipe through Reflection Engine
    if (autoExecute === 'true' || autoExecute === true) {
      const agentResult = await reflectionEngine.executeWithReflection({
        inputPrompt: transcript,
        inputPromptMl: transcriptMl,
        inputType: 'voice',
        language: language as any
      });

      return res.status(200).json({
        transcription: transcriptionResult,
        agentExecution: agentResult
      });
    }

    return res.status(200).json(transcriptionResult);
  } catch (error: any) {
    console.error('[VoiceRouter] Transcription error:', error);
    return res.status(500).json({ error: error.message || 'Voice transcription failed' });
  }
});
