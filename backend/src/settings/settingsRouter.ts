import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';
import { prisma } from '../db.js';

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
 * Update merchant profile details in memory and in PostgreSQL database
 */
settingsRouter.put('/profile', async (req: Request, res: Response) => {
  try {
    const updated = store.updateProfile(req.body);

    // Also persist update to PostgreSQL if phone exists
    if (updated.phone) {
      try {
        await prisma.businessProfile.updateMany({
          where: { phone: updated.phone },
          data: {
            businessName: updated.name,
            businessNameMl: updated.nameMl,
            ownerName: updated.owner,
            ownerNameMl: updated.ownerMl,
            address: updated.location,
            gstin: updated.gstin || null,
            updatedAt: new Date()
          }
        });
      } catch (dbErr) {
        console.warn('[Settings DB] Error syncing profile update to database:', dbErr);
      }
    }

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

/**
 * PUT /api/settings/preferences
 * Update preferences (WhatsApp, low stock alert, UPI ID)
 */
settingsRouter.put('/preferences', async (req: Request, res: Response) => {
  try {
    const current = store.getSettings();
    const updated = store.updateSettings({
      ...current,
      contactPreferences: {
        ...current.contactPreferences,
        ...req.body
      }
    });

    const activeProfile = store.getProfile();
    if (activeProfile.phone && req.body.upiId !== undefined) {
      try {
        await prisma.businessProfile.updateMany({
          where: { phone: activeProfile.phone },
          data: {
            upiId: req.body.upiId,
            updatedAt: new Date()
          }
        });
      } catch (dbErr) {
        console.warn('[Settings DB] Error syncing UPI to database:', dbErr);
      }
    }

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update preferences' });
  }
});
