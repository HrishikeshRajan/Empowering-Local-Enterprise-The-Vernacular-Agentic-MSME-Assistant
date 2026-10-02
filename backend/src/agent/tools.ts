import { store } from '../data/store.js';
import type { AgentToolType, InventoryItem, InvoiceData, Appointment } from '@msme/shared';
import {
  InventoryUpdatePayloadSchema,
  WhatsAppSendPayloadSchema,
  CalendarCheckPayloadSchema,
  InventoryQueryPayloadSchema
} from './schemas.js';

export interface ToolExecutionResponse {
  success: boolean;
  tool: AgentToolType;
  summary: string;
  summaryMl: string;
  data: any;
  error?: string;
}

export const agentTools: Record<AgentToolType, (params: any) => Promise<ToolExecutionResponse>> = {
  db_write: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = InventoryUpdatePayloadSchema.parse(params);
    const existing = store.findInventoryByName(validated.productName);

    if (existing) {
      const updatedStock = existing.currentStock + validated.quantity;
      const updates: Partial<InventoryItem> = {
        currentStock: updatedStock,
        lastRestocked: 'Just now (via Voice Agent)'
      };
      if (validated.pricePerUnit) {
        updates.unitPrice = validated.pricePerUnit;
      }
      const updated = store.updateInventoryItem(existing.id, updates);
      return {
        success: true,
        tool: 'db_write',
        summary: `Updated ${existing.name}: +${validated.quantity} ${existing.unit} (Total: ${updatedStock} ${existing.unit})${validated.pricePerUnit ? `, Price: ₹${validated.pricePerUnit}/${existing.unit}` : ''}.`,
        summaryMl: `${existing.nameMl} സ്റ്റോക്ക് പുതുക്കി: +${validated.quantity} ${existing.unit} (ആകെ: ${updatedStock} ${existing.unit})${validated.pricePerUnit ? `, വില ₹${validated.pricePerUnit}/${existing.unit}` : ''}.`,
        data: updated
      };
    } else {
      const newItem = store.addInventoryItem({
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
      return {
        success: true,
        tool: 'db_write',
        summary: `Created new inventory item ${newItem.name} with ${newItem.currentStock} ${newItem.unit} at ₹${newItem.unitPrice}/${newItem.unit}.`,
        summaryMl: `പുതിയ സാധനം ${newItem.name} സ്റ്റോക്കിൽ ചേർത്തു: ${newItem.currentStock} ${newItem.unit}, വില ₹${newItem.unitPrice}/${newItem.unit}.`,
        data: newItem
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
        summaryMl: `${profile.nameMl} സ്റ്റോർ വിവരങ്ങൾ എടുത്തു.`,
        data: profile
      };
    }
  },

  whatsapp_send: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = WhatsAppSendPayloadSchema.parse(params);
    let conv = store.findConversationByPhone(validated.recipientPhone);
    const convId = conv ? conv.id : `conv-${Date.now()}`;

    const sentMessage = store.addMessage(convId, {
      sender: 'agent',
      text: validated.messageText,
      textMl: validated.messageTextMl || validated.messageText,
      status: 'delivered',
      hasPaymentLink: validated.includePaymentLink,
      paymentAmount: validated.amount
    });

    return {
      success: true,
      tool: 'whatsapp_send',
      summary: `Delivered WhatsApp message to ${validated.customerName || validated.recipientPhone}${validated.amount ? ` with ₹${validated.amount} payment link` : ''}.`,
      summaryMl: `${validated.customerName || validated.recipientPhone} എന്ന നമ്പറിലേക്ക് WhatsApp സന്ദേശം അയച്ചു${validated.amount ? ` (തുക ₹${validated.amount})` : ''}.`,
      data: sentMessage
    };
  },

  invoice_parse: async (params: any): Promise<ToolExecutionResponse> => {
    // Uses pre-indexed or simulated Gemini Flash Vision parser
    const invoices = store.getInvoices();
    const existing = params.invoiceNo ? invoices.find(i => i.invoiceNo === params.invoiceNo) : invoices[0];
    
    if (existing) {
      return {
        success: true,
        tool: 'invoice_parse',
        summary: `Parsed invoice #${existing.invoiceNo} from ${existing.vendorName}. Total: ₹${existing.grandTotal} (${existing.items.length} items).`,
        summaryMl: `${existing.vendorNameMl} ഇൻവോയ്സ് #${existing.invoiceNo} പരിശോധിച്ചു. ആകെ തുക ₹${existing.grandTotal} (${existing.items.length} ഇനങ്ങൾ).`,
        data: existing
      };
    }

    const newInvoice: InvoiceData = {
      id: `inv-${Date.now()}`,
      invoiceNo: params.invoiceNo || `INV/${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-GB'),
      vendorName: 'WAYANAD SPICE TRADERS',
      vendorNameMl: 'വയനാട് സ്പൈസ് ട്രേഡേഴ്സ്',
      vendorGstin: '32AABCT1234K1Z5',
      vendorAddress: 'Meenangadi, Wayanad - 673591',
      buyerName: 'MALABAR SPICES',
      buyerGstin: '32ABCPB9876C1Z1',
      imageUrl: params.imageUrl || '/sample_invoice.jpg',
      status: 'verified',
      guardrailsPassed: true,
      varianceAmount: 0.0,
      subTotal: 12000.0,
      cgst: 1080.0,
      sgst: 1080.0,
      grandTotal: 14160.0,
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: 'Cardamom Grade 1',
          nameMl: 'ഏലക്ക ഗ്രേഡ് 1',
          hsn: '090831',
          qty: '10kg',
          unit: 'kg',
          rate: 1200.0,
          amount: 12000.0,
          confidence: 98.5
        }
      ]
    };
    store.addInvoice(newInvoice);

    return {
      success: true,
      tool: 'invoice_parse',
      summary: `Parsed newly submitted invoice #${newInvoice.invoiceNo}. Total: ₹${newInvoice.grandTotal} with 100% tax accuracy.`,
      summaryMl: `പുതിയ ഇൻവോയ്സ് #${newInvoice.invoiceNo} വിജയകരമായി പരിശോധിച്ചു. തുക ₹${newInvoice.grandTotal}.`,
      data: newInvoice
    };
  },

  calendar_check: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = CalendarCheckPayloadSchema.parse(params);
    const newApt = store.addAppointment({
      customerName: validated.customerName,
      phone: validated.phone,
      service: validated.service,
      serviceMl: validated.service,
      date: validated.date,
      timeSlot: validated.timeSlot,
      status: 'confirmed',
      notes: 'Booked via Vernacular Agent reflection loop.'
    });

    return {
      success: true,
      tool: 'calendar_check',
      summary: `Confirmed appointment for ${validated.customerName} on ${validated.date} (${validated.timeSlot}).`,
      summaryMl: `${validated.customerName}ന്റെ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിച്ചു: ${validated.date} (${validated.timeSlot}).`,
      data: newApt
    };
  },

  inventory_query: async (params: any): Promise<ToolExecutionResponse> => {
    const validated = InventoryQueryPayloadSchema.parse(params);
    const item = store.findInventoryByName(validated.productName);

    if (item) {
      return {
        success: true,
        tool: 'inventory_query',
        summary: `Found ${item.name}: Current stock is ${item.currentStock} ${item.unit} at ₹${item.unitPrice}/${item.unit} (Reorder level: ${item.reorderLevel} ${item.unit}).`,
        summaryMl: `${item.nameMl}: കൈവശം ${item.currentStock} ${item.unit} ലഭ്യമാണ്. വില ₹${item.unitPrice}/${item.unit} (കുറഞ്ഞ അളവ്: ${item.reorderLevel} ${item.unit}).`,
        data: item
      };
    }

    return {
      success: false,
      tool: 'inventory_query',
      summary: `Product "${validated.productName}" not found in current inventory catalogue.`,
      summaryMl: `"${validated.productName}" നിലവിൽ സ്റ്റോക്കിൽ കണ്ടെത്തിയില്ല.`,
      data: null,
      error: 'Product not found'
    };
  }
};
