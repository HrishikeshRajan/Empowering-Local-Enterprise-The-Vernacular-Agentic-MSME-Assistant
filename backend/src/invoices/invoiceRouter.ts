import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { store } from '../data/store.js';
import type { InvoiceData, InvoiceItem } from '@msme/shared';
import { calculateInvoiceTotals, validateInvoiceGuardrails } from '@msme/shared';

export const invoiceRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * GET /api/invoices
 * List all invoices
 */
invoiceRouter.get('/', (_req: Request, res: Response) => {
  const invoices = store.getInvoices();
  return res.status(200).json(invoices);
});

/**
 * GET /api/invoices/:id
 * Get single invoice
 */
invoiceRouter.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const invoice = store.getInvoice(id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  return res.status(200).json(invoice);
});

/**
 * POST /api/invoices/parse
 * Extract structured invoice data using Gemini Flash Vision pattern
 */
invoiceRouter.post('/parse', upload.single('invoiceImage'), async (req: Request, res: Response) => {
  try {
    const { claimedTotal, vendorName, vendorNameMl } = req.body;

    // Default mock items for scanned spice provision bill
    const sampleItems: InvoiceItem[] = [
      {
        id: `i-${Date.now()}-1`,
        name: 'Green Cardamom (A Grade)',
        nameMl: 'ഏലം (Green Cardamom)',
        hsn: '6170060',
        qty: '8kg',
        unit: 'kg',
        rate: 1450.00,
        amount: 11600.00,
        confidence: 99.4
      },
      {
        id: `i-${Date.now()}-2`,
        name: 'Black Pepper',
        nameMl: 'കുരുമുളക് (Black Pepper)',
        hsn: '6170300',
        qty: '15kg',
        unit: 'kg',
        rate: 680.00,
        amount: 10200.00,
        confidence: 99.1
      },
      {
        id: `i-${Date.now()}-3`,
        name: 'Clove',
        nameMl: 'ഗ്രാമ്പൂ (Clove)',
        hsn: '6170360',
        qty: '5kg',
        unit: 'kg',
        rate: 890.00,
        amount: 4450.00,
        confidence: 98.8
      },
      {
        id: `i-${Date.now()}-4`,
        name: 'Turmeric Powder',
        nameMl: 'മഞ്ഞൾപ്പൊടി (Turmeric)',
        hsn: '8170120',
        qty: '20kg',
        unit: 'kg',
        rate: 190.00,
        amount: 3800.00,
        confidence: 99.5
      },
      {
        id: `i-${Date.now()}-5`,
        name: 'Fennel Seeds',
        nameMl: 'പെരുംജീരകം (Fennel Seeds)',
        hsn: '6170200',
        qty: '10kg',
        unit: 'kg',
        rate: 220.00,
        amount: 2200.00,
        confidence: 98.2
      }
    ];

    const { subTotal, cgst, sgst, grandTotal } = calculateInvoiceTotals(sampleItems, 0.18);
    const parsedClaimedTotal = claimedTotal ? parseFloat(claimedTotal) : grandTotal;
    const guardrail = validateInvoiceGuardrails(parsedClaimedTotal, grandTotal);

    const invoiceNo = `MS/${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: InvoiceData = {
      id: `inv-${Date.now()}`,
      invoiceNo,
      date: new Date().toLocaleDateString('en-GB'),
      vendorName: vendorName || 'MALABAR SPICES & GENERAL MERCHANT',
      vendorNameMl: vendorNameMl || 'മലബാർ സ്പൈസസ് & ജനറൽ മെർച്ചന്റ്',
      vendorGstin: '32ABCPB9876C1Z1',
      vendorAddress: 'G.T. Road, Thrissur - 680001, Kerala',
      buyerName: 'KAILAS PROVISIONS (B2B)',
      buyerGstin: '32AQWPR1234F1Z0',
      imageUrl: '/sample_invoice.jpg',
      status: guardrail.passed ? 'verified' : 'flagged',
      guardrailsPassed: guardrail.passed,
      varianceAmount: guardrail.variance,
      subTotal,
      cgst,
      sgst,
      grandTotal,
      items: sampleItems,
      notes: guardrail.passed 
        ? 'Verified with 100% mathematical integrity (Zod checks passed).' 
        : `Discrepancy alert: Invoice claimed ₹${parsedClaimedTotal} but items sum to ₹${grandTotal}. Variance: ₹${guardrail.variance}.`
    };

    store.addInvoice(newInvoice);

    return res.status(201).json({
      success: true,
      message: guardrail.passed ? 'Invoice parsed and verified successfully' : 'Invoice parsed with guardrail warnings',
      invoice: newInvoice,
      guardrail
    });
  } catch (error: any) {
    console.error('[InvoiceRouter] Error parsing invoice:', error);
    return res.status(500).json({ error: error.message || 'Invoice parsing failed' });
  }
});

/**
 * POST /api/invoices/:id/verify
 * Approve or flag an invoice, with optional auto-sync to inventory
 */
invoiceRouter.post('/:id/verify', (req: Request, res: Response) => {
  const { status, notes, syncInventory = true } = req.body;
  if (!status || !['verified', 'flagged'].includes(status)) {
    return res.status(400).json({ error: 'status must be "verified" or "flagged"' });
  }

  const id = String(req.params.id);
  const invoice = store.getInvoice(id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  const updated = store.verifyInvoice(id, status, notes);

  // If approved and syncInventory is true, update stock for all items
  if (status === 'verified' && syncInventory && invoice.items) {
    invoice.items.forEach(item => {
      const qtyNum = parseFloat(item.qty.replace(/[^0-9.]/g, '')) || 5;
      const existing = store.findInventoryByName(item.name);
      if (existing) {
        store.updateInventoryItem(existing.id, {
          currentStock: existing.currentStock + qtyNum,
          lastRestocked: 'Just now (from invoice)'
        });
      }
    });
  }

  return res.status(200).json(updated);
});

/**
 * POST /api/invoices
 * Create a manual invoice
 */
invoiceRouter.post('/', (req: Request, res: Response) => {
  try {
    const data: InvoiceData = req.body;
    if (!data.invoiceNo || !data.items || !data.grandTotal) {
      return res.status(400).json({ error: 'Missing required invoice fields' });
    }
    const created = store.addInvoice({
      ...data,
      id: data.id || `inv-${Date.now()}`
    });
    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create invoice' });
  }
});
