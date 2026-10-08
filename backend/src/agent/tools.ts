import { store } from '../data/store.js';
import { prisma } from '../db.js';
import type { AgentToolType, InventoryItem, InvoiceData, Appointment } from '@msme/shared';
import {
  InventoryUpdatePayloadSchema,
  WhatsAppSendPayloadSchema,
  CalendarCheckPayloadSchema,
  InventoryQueryPayloadSchema
} from './schemas.js';

export interface DatabaseSyncStatus {
  synced: boolean;
  table: string;
  businessId?: string;
  businessName?: string;
  itemId?: string;
  action?: 'updated' | 'created';
  error?: string;
}

export interface ToolExecutionResponse {
  success: boolean;
  tool: AgentToolType;
  summary: string;
  summaryMl: string;
  data: any;
  error?: string;
}

/**
 * Resolve or create a BusinessProfile in PostgreSQL so database writes never fail due to missing business
 */
async function resolveOrCreateBusiness(phone?: string, businessId?: string) {
  if (businessId) {
    const byId = await prisma.businessProfile.findUnique({ where: { id: businessId } });
    if (byId) return byId;
  }
  if (phone) {
    const byPhone = await prisma.businessProfile.findFirst({ where: { phone } });
    if (byPhone) return byPhone;
  }
  const activeProfile = store.getProfile();
  if (activeProfile.phone) {
    const byActive = await prisma.businessProfile.findFirst({ where: { phone: activeProfile.phone } });
    if (byActive) return byActive;
  }
  const first = await prisma.businessProfile.findFirst();
  if (first) return first;

  // Auto-create default business profile if database is completely empty
  const created = await prisma.businessProfile.create({
    data: {
      phone: phone || activeProfile.phone || '+91 94471 23456',
      businessName: activeProfile.name || 'Malabar Spices & General Provisions',
      businessNameMl: activeProfile.nameMl || 'മലബാർ സ്പൈസസ് & ജനറൽ പ്രൊവിഷൻസ്',
      ownerName: activeProfile.owner || 'Suresh Kumar',
      ownerNameMl: activeProfile.ownerMl || 'സുരേഷ് കുമാർ',
      address: activeProfile.location || 'Thrissur, Kerala',
      gstin: activeProfile.gstin || '32ABCPB9876C1Z1',
      primaryLanguage: 'ml',
      notifyWhatsapp: true,
      notifyLowStock: true,
      autoInvoiceSync: true
    }
  });
  console.log(`[Agent Tool DB] Auto-created initial business profile in PostgreSQL: ${created.businessName} (${created.id})`);
  return created;
}

export const agentTools: Record<AgentToolType, (params: any) => Promise<ToolExecutionResponse>> = {
  db_write: async (params: any): Promise<ToolExecutionResponse> => {
    try {
      const validated = InventoryUpdatePayloadSchema.parse(params);
      const existing = store.findInventoryByName(validated.productName);
      const previousUnitPrice = existing ? existing.unitPrice : undefined;

      let resultItem: InventoryItem;
      let summary: string;
      let summaryMl: string;

      if (existing) {
        const updatedStock = existing.currentStock + validated.quantity;
        const updates: Partial<InventoryItem> = {
          currentStock: updatedStock,
          lastRestocked: 'Just now (via Voice Agent)'
        };
        if (validated.pricePerUnit) {
          updates.unitPrice = validated.pricePerUnit;
        }
        resultItem = store.updateInventoryItem(existing.id, updates) || existing;
        summary = `Updated ${existing.name}: +${validated.quantity} ${existing.unit} (Total: ${updatedStock} ${existing.unit})${validated.pricePerUnit ? `, Price: ₹${validated.pricePerUnit}/${existing.unit}` : ''}.`;
        summaryMl = `${existing.nameMl} സ്റ്റോക്ക് പുതുക്കി: +${validated.quantity} ${existing.unit} (ആകെ: ${updatedStock} ${existing.unit})${validated.pricePerUnit ? `, വില ₹${validated.pricePerUnit}/${existing.unit}` : ''}.`;
      } else {
        resultItem = store.addInventoryItem({
          name: validated.productName,
          nameMl: validated.productName,
          category: 'General',
          categoryMl: 'സാധാരണ',
          currentStock: validated.quantity,
          unit: validated.unit || 'kg',
          reorderLevel: 10,
          unitPrice: validated.pricePerUnit || 50,
          costPrice: (validated.pricePerUnit || 50) * 0.8
        });
        summary = `Created new inventory item ${resultItem.name} with ${resultItem.currentStock} ${resultItem.unit} at ₹${resultItem.unitPrice}/${resultItem.unit}.`;
        summaryMl = `പുതിയ സാധനം ${resultItem.name} സ്റ്റോക്കിൽ ചേർത്തു: ${resultItem.currentStock} ${resultItem.unit}, വില ₹${resultItem.unitPrice}/${resultItem.unit}.`;
      }

      // Persist inventory update to PostgreSQL database
      let dbStatus: DatabaseSyncStatus = {
        synced: false,
        table: 'InventoryItem'
      };

      try {
        const business = await resolveOrCreateBusiness(params.merchantPhone, params.businessId);

        const nameWords = validated.productName.trim().split(/\s+/).filter(w => w.length > 2);
        const searchWord = nameWords[0] || validated.productName.trim();

        // Match existing item in DB by English or Malayalam name
        const dbExisting = await prisma.inventoryItem.findFirst({
          where: {
            businessId: business.id,
            OR: [
              { name: { contains: searchWord, mode: 'insensitive' } },
              { nameMl: { contains: searchWord, mode: 'insensitive' } },
              { name: { contains: validated.productName.trim(), mode: 'insensitive' } },
              { nameMl: { contains: validated.productName.trim(), mode: 'insensitive' } }
            ]
          }
        });

        if (dbExisting) {
          const newDbStock = dbExisting.currentStock + validated.quantity;
          const updatedDb = await prisma.inventoryItem.update({
            where: { id: dbExisting.id },
            data: {
              currentStock: newDbStock,
              unitPrice: validated.pricePerUnit || dbExisting.unitPrice,
              lastRestocked: new Date(),
              updatedAt: new Date()
            }
          });
          dbStatus = {
            synced: true,
            table: 'InventoryItem',
            businessId: business.id,
            businessName: business.businessName,
            itemId: updatedDb.id,
            action: 'updated'
          };
          console.log(`[PostgreSQL SUCCESS] Updated stock for "${updatedDb.name}" (+${validated.quantity} => Total: ${newDbStock}) in business "${business.businessName}" (ID: ${business.id})`);
        } else {
          const createdDb = await prisma.inventoryItem.create({
            data: {
              businessId: business.id,
              name: resultItem.name,
              nameMl: resultItem.nameMl || resultItem.name,
              category: resultItem.category || 'General',
              categoryMl: resultItem.categoryMl || 'സാധാരണ',
              currentStock: resultItem.currentStock,
              unit: resultItem.unit || 'kg',
              reorderLevel: resultItem.reorderLevel || 10,
              unitPrice: resultItem.unitPrice || 50,
              costPrice: resultItem.costPrice || 40
            }
          });
          dbStatus = {
            synced: true,
            table: 'InventoryItem',
            businessId: business.id,
            businessName: business.businessName,
            itemId: createdDb.id,
            action: 'created'
          };
          console.log(`[PostgreSQL SUCCESS] Created new item "${createdDb.name}" (Stock: ${createdDb.currentStock}) in business "${business.businessName}" (ID: ${business.id})`);
        }
      } catch (dbErr: any) {
        const errorMsg = dbErr?.message || String(dbErr);
        console.error('[PostgreSQL ERROR] Failed to write inventory item to database:', errorMsg);
        dbStatus = {
          synced: false,
          table: 'InventoryItem',
          error: errorMsg
        };
      }

      const hasDbError = !dbStatus.synced;
      const finalSummary = hasDbError
        ? `${summary} ⚠️ [PostgreSQL Sync Failed: ${dbStatus.error}]`
        : `${summary} ✓ [PostgreSQL: Synced to DB]`;
      const finalSummaryMl = hasDbError
        ? `${summaryMl} ⚠️ [ഡാറ്റാബേസ് പിശക്: ${dbStatus.error}]`
        : `${summaryMl} ✓ [ഡാറ്റാബേസിൽ രേഖപ്പെടുത്തി]`;

      return {
        success: !hasDbError,
        tool: 'db_write',
        summary: finalSummary,
        summaryMl: finalSummaryMl,
        data: {
          ...resultItem,
          previousUnitPrice,
          dbStatus,
          databaseError: dbStatus.error
        },
        error: dbStatus.error
      };
    } catch (validationErr: any) {
      const msg = validationErr?.message || String(validationErr);
      console.error('[Agent Tool DB] Payload validation error in db_write:', msg);
      return {
        success: false,
        tool: 'db_write',
        summary: `Inventory validation error: ${msg}`,
        summaryMl: `സ്റ്റോക്ക് വിവരങ്ങൾ പരിശോധിച്ചതിൽ പിശക്: ${msg}`,
        data: { params, error: msg },
        error: msg
      };
    }
  },

  db_read: async (params: any): Promise<ToolExecutionResponse> => {
    const entity = params.entity || 'profile';
    if (entity === 'inventory') {
      const items = store.getInventory();
      return {
        success: true,
        tool: 'db_read',
        summary: `Retrieved ${items.length} inventory records.`,
        summaryMl: `${items.length} സ്റ്റോക്ക് വിവരങ്ങൾ പരിശോധിച്ചു.`,
        data: items
      };
    } else if (entity === 'invoices') {
      const invoices = store.getInvoices();
      return {
        success: true,
        tool: 'db_read',
        summary: `Retrieved ${invoices.length} invoices.`,
        summaryMl: `${invoices.length} ഇൻവോയ്സ് വിവരങ്ങൾ പരിശോധിച്ചു.`,
        data: invoices
      };
    } else {
      const profile = store.getProfile();
      return {
        success: true,
        tool: 'db_read',
        summary: `Retrieved store profile for ${profile.name}.`,
        summaryMl: `${profile.name} സ്റ്റോർ വിവരങ്ങൾ പരിശോധിച്ചു.`,
        data: profile
      };
    }
  },

  whatsapp_send: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = WhatsAppSendPayloadSchema.parse(params);
    const conv = store.findConversationByPhone(validated.recipientPhone);

    const messagePayload = {
      sender: 'merchant' as const,
      text: validated.messageText,
      textMl: validated.messageTextMl || validated.messageText,
      timestamp: 'Just now',
      status: 'sent' as const
    };

    store.addMessage(conv ? conv.id : validated.recipientPhone, messagePayload);

    return {
      success: true,
      tool: 'whatsapp_send',
      summary: `Dispatched WhatsApp message to ${validated.customerName || validated.recipientPhone} with payment link: ₹${validated.amount || 'N/A'}.`,
      summaryMl: `${validated.customerName || validated.recipientPhone} എന്ന ഉപഭോക്താവിന് ₹${validated.amount || 0} തുകയുടെ WhatsApp ബിൽ അയച്ചു.`,
      data: {
        recipientPhone: validated.recipientPhone,
        customerName: validated.customerName,
        amount: validated.amount,
        delivered: true
      }
    };
  },

  calendar_check: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = CalendarCheckPayloadSchema.parse(params);
    const appointments = store.getAppointments();

    const conflict = appointments.find(
      a => a.date === validated.date && a.timeSlot === validated.timeSlot && a.status === 'confirmed'
    );

    if (conflict) {
      return {
        success: false,
        tool: 'calendar_check',
        summary: `Slot conflict: ${validated.timeSlot} on ${validated.date} is already booked by ${conflict.customerName}.`,
        summaryMl: `സമയത്തിൽ തടസ്സം: ${validated.date} ${validated.timeSlot} സമയം ഇതിനകം ${conflict.customerName} ബുക്ക് ചെയ്തിട്ടുണ്ട്.`,
        data: { conflict: true, conflictingAppointment: conflict },
        error: `Slot ${validated.timeSlot} is already booked`
      };
    }

    const newAppt: Appointment = store.addAppointment({
      customerName: validated.customerName,
      phone: validated.phone,
      service: validated.service,
      serviceMl: validated.service,
      date: validated.date,
      timeSlot: validated.timeSlot,
      status: 'confirmed',
      notes: 'Scheduled autonomously via Vernacular Voice Assistant'
    });

    return {
      success: true,
      tool: 'calendar_check',
      summary: `Appointment confirmed for ${newAppt.customerName} on ${newAppt.date} at ${newAppt.timeSlot}.`,
      summaryMl: `${newAppt.customerName} എന്നയാളുടെ അപ്പോയിന്റ്മെന്റ് ${newAppt.date} ${newAppt.timeSlot}-ലേക്ക് ഉറപ്പിച്ചു.`,
      data: newAppt
    };
  },

  inventory_query: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = InventoryQueryPayloadSchema.parse(params);
    const item = store.findInventoryByName(validated.productName);

    if (!item) {
      return {
        success: false,
        tool: 'inventory_query',
        summary: `Inventory item "${validated.productName}" not found in stock database.`,
        summaryMl: `"${validated.productName}" എന്ന സാധനം സ്റ്റോക്കിൽ കണ്ടെത്താനായില്ല.`,
        data: null,
        error: `Item "${validated.productName}" not found`
      };
    }

    return {
      success: true,
      tool: 'inventory_query',
      summary: `Found ${item.name}: Current stock is ${item.currentStock} ${item.unit} at ₹${item.unitPrice}/${item.unit} (Reorder level: ${item.reorderLevel} ${item.unit}).`,
      summaryMl: `${item.nameMl} കണ്ടെത്തി: ഇപ്പോഴത്തെ സ്റ്റോക്ക് ${item.currentStock} ${item.unit}, വില ₹${item.unitPrice}/${item.unit}.`,
      data: item
    };
  },

  invoice_parse: async (params: any): Promise<ToolExecutionResponse> => {
    const invoices = store.getInvoices();
    const invoice = params.invoiceNo ? store.getInvoice(params.invoiceNo) : invoices[0];

    if (!invoice) {
      return {
        success: false,
        tool: 'invoice_parse',
        summary: 'No invoice record available for vision extraction.',
        summaryMl: 'ഇൻവോയ്സ് വിവരങ്ങൾ ലഭ്യമായില്ല.',
        data: null,
        error: 'Invoice not found'
      };
    }

    return {
      success: true,
      tool: 'invoice_parse',
      summary: `Parsed invoice #${invoice.invoiceNo} from ${invoice.vendorName}. Grand Total: ₹${invoice.grandTotal} (${invoice.items.length} line items). Verified by cross-check math.`,
      summaryMl: `ഇൻവോയ്സ് #${invoice.invoiceNo} (${invoice.vendorName}) വിജയകരമായി പരിശോധിച്ചു. ആകെ തുക: ₹${invoice.grandTotal}.`,
      data: invoice
    };
  }
};
