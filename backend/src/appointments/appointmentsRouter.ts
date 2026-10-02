import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';

export const appointmentsRouter = Router();

/**
 * GET /api/appointments
 * List all scheduled appointments
 */
appointmentsRouter.get('/', (_req: Request, res: Response) => {
  const appointments = store.getAppointments();
  return res.status(200).json(appointments);
});

/**
 * POST /api/appointments
 * Create a new appointment
 */
appointmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { customerName, phone, service, serviceMl, date, timeSlot, notes } = req.body;

    if (!customerName || !phone || !service || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    const created = store.addAppointment({
      customerName,
      phone,
      service,
      serviceMl: serviceMl || service,
      date,
      timeSlot,
      status: 'confirmed',
      notes: notes || 'Booked directly via MSME Assistant.'
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create appointment' });
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status (confirmed, pending, completed)
 */
appointmentsRouter.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['confirmed', 'pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be confirmed, pending, or completed' });
  }

  const id = String(req.params.id);
  const updated = store.updateAppointmentStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  return res.status(200).json(updated);
});
