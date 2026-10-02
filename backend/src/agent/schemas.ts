import { z } from 'zod';

export const AgentToolEnum = z.enum([
  'db_write',
  'db_read',
  'whatsapp_send',
  'invoice_parse',
  'inventory_query',
  'calendar_check'
]);

export const InventoryUpdatePayloadSchema = z.object({
  action: z.enum(['add_stock', 'create_product', 'update_price']),
  productName: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().default('kg'),
  pricePerUnit: z.number().positive().optional()
});

export const WhatsAppSendPayloadSchema = z.object({
  recipientPhone: z.string().min(8),
  customerName: z.string().optional(),
  messageText: z.string().min(1),
  messageTextMl: z.string().optional(),
  includePaymentLink: z.boolean().default(false),
  amount: z.number().positive().optional(),
  invoiceNo: z.string().optional()
});

export const CalendarCheckPayloadSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(8),
  service: z.string().min(1),
  date: z.string(),
  timeSlot: z.string()
});

export const InventoryQueryPayloadSchema = z.object({
  productName: z.string().min(1)
});

export const InvoiceParsePayloadSchema = z.object({
  invoiceNo: z.string().optional(),
  imageUrl: z.string().optional(),
  rawText: z.string().optional()
});

export const IntentParseResultSchema = z.object({
  tool: AgentToolEnum,
  confidence: z.number().min(0).max(100),
  intentExplanation: z.string(),
  intentExplanationMl: z.string(),
  params: z.record(z.any())
});

export type IntentParseResult = z.infer<typeof IntentParseResultSchema>;
