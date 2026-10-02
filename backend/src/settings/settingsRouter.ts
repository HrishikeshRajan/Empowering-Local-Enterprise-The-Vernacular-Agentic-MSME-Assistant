import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';

export const settingsRouter = Router();

/**
 * GET /api/settings
 * Get store profile and contact preferences
 */
settingsRouter.get('/', (_req: Request, res: Response) => {
  const profile = store.getProfile();
  const settings = store.getSettings();
  return res.status(200).json({ profile, settings });
});

/**
 * PUT /api/settings/profile
 * Update merchant profile details
 */
settingsRouter.put('/profile', (req: Request, res: Response) => {
  try {
    const updated = store.updateProfile(req.body);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

/**
 * PUT /api/settings/preferences
 * Update preferences (WhatsApp, low stock alert, UPI ID)
 */
settingsRouter.put('/preferences', (req: Request, res: Response) => {
  try {
    const current = store.getSettings();
    const updated = store.updateSettings({
      ...current,
      contactPreferences: {
        ...current.contactPreferences,
        ...req.body
      }
    });
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update preferences' });
  }
});
