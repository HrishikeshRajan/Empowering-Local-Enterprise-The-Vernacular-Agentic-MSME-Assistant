export * from './types.js';

export const CONFIDENCE_THRESHOLD_REVIEW = 80; // Below 80% flagged for manual review
export const MAX_PRICE_DEVIATION_PERCENT = 50; // Alert if price changes >50%
export const INVOICE_TOLERANCE_RUPEES = 1.0; // Total must match line items within +/- 1 INR

export function calculateInvoiceTotals(items: { amount: number }[], taxRate: number = 0.18) {
  const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalTax = subTotal * taxRate;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;
  const grandTotal = Math.round((subTotal + cgst + sgst) * 100) / 100;
  return { subTotal, cgst, sgst, grandTotal };
}

export function validateInvoiceGuardrails(
  claimedGrandTotal: number, 
  calculatedGrandTotal: number, 
  tolerance: number = INVOICE_TOLERANCE_RUPEES
) {
  const variance = Math.abs(claimedGrandTotal - calculatedGrandTotal);
  return {
    passed: variance <= tolerance,
    variance: Math.round(variance * 100) / 100
  };
}
