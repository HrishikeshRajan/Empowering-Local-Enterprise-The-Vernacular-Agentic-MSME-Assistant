import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';
import { MAX_PRICE_DEVIATION_PERCENT } from '@msme/shared';

function safeFloat(val: any, fallback?: number): number | undefined {
  const n = parseFloat(String(val));
  if (isNaN(n) || !isFinite(n) || n < 0) return fallback;
  return n;
}

function requireFloat(val: any, field: string): { ok: true; value: number } | { ok: false; error: string } {
  const n = parseFloat(String(val));
  if (isNaN(n) || !isFinite(n) || n < 0) return { ok: false, error: `${field} must be a non-negative number` };
  return { ok: true, value: n };
}

export const inventoryRouter = Router();

/**
 * GET /api/inventory
 * Return full inventory stock list
 */
inventoryRouter.get('/', (_req: Request, res: Response) => {
  const items = store.getInventory();
  return res.status(200).json(items);
});

/**
 * GET /api/inventory/alerts
 * Return low-stock items that need reordering
 */
inventoryRouter.get('/alerts', (_req: Request, res: Response) => {
  const items = store.getInventory();
  const lowStock = items.filter(item => item.currentStock <= item.reorderLevel);
  return res.status(200).json({
    count: lowStock.length,
    items: lowStock
  });
});

/**
 * POST /api/inventory
 * Add a new inventory item
 */
inventoryRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, nameMl, category, categoryMl, currentStock, unit, reorderLevel, unitPrice, costPrice } = req.body;

    if (!name || currentStock === undefined || unitPrice === undefined) {
      return res.status(400).json({ error: 'name, currentStock, and unitPrice are required' });
    }

    const stockCheck  = requireFloat(currentStock, 'currentStock');
    const priceCheck  = requireFloat(unitPrice, 'unitPrice');
    if (!stockCheck.ok)  return res.status(400).json({ error: stockCheck.error });
    if (!priceCheck.ok)  return res.status(400).json({ error: priceCheck.error });

    const newItem = store.addInventoryItem({
      name: String(name).slice(0, 120),
      nameMl: nameMl ? String(nameMl).slice(0, 120) : String(name).slice(0, 120),
      category: category ? String(category).slice(0, 60) : 'General',
      categoryMl: categoryMl ? String(categoryMl).slice(0, 60) : 'സാധാരണ',
      currentStock: stockCheck.value,
      unit: unit ? String(unit).slice(0, 20) : 'kg',
      reorderLevel: safeFloat(reorderLevel) ?? 10,
      unitPrice: priceCheck.value,
      costPrice: safeFloat(costPrice) ?? priceCheck.value * 0.8,
    });

    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to add item' });
  }
});

/**
 * PUT /api/inventory/:id
 * Update an existing inventory item (with guardrail on price fluctuation)
 */
inventoryRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = store.getInventoryItem(id);
    if (!existing) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const { name, nameMl, category, categoryMl, currentStock, unit, reorderLevel, unitPrice, costPrice } = req.body;
    let guardrailWarning: string | null = null;

    if (unitPrice !== undefined && existing.unitPrice > 0) {
      const priceVal = parseFloat(unitPrice);
      const percentChange = Math.abs(priceVal - existing.unitPrice) / existing.unitPrice * 100;
      if (percentChange > MAX_PRICE_DEVIATION_PERCENT) {
        guardrailWarning = `Price changed by ${percentChange.toFixed(1)}% (exceeds ${MAX_PRICE_DEVIATION_PERCENT}% safety guardrail)`;
      }
    }

    const updated = store.updateInventoryItem(id, {
      ...(name        && { name: String(name).slice(0, 120) }),
      ...(nameMl      && { nameMl: String(nameMl).slice(0, 120) }),
      ...(category    && { category: String(category).slice(0, 60) }),
      ...(categoryMl  && { categoryMl: String(categoryMl).slice(0, 60) }),
      ...(currentStock !== undefined && { currentStock: safeFloat(currentStock) ?? existing.currentStock }),
      ...(unit        && { unit: String(unit).slice(0, 20) }),
      ...(reorderLevel !== undefined && { reorderLevel: safeFloat(reorderLevel) ?? existing.reorderLevel }),
      ...(unitPrice    !== undefined && { unitPrice: safeFloat(unitPrice) ?? existing.unitPrice }),
      ...(costPrice    !== undefined && { costPrice: safeFloat(costPrice) ?? existing.costPrice }),
      lastRestocked: 'Just now',
    });

    return res.status(200).json({
      item: updated,
      warning: guardrailWarning
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update item' });
  }
});

/**
 * DELETE /api/inventory/:id
 * Delete an inventory item
 */
inventoryRouter.delete('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const success = store.deleteInventoryItem(id);
  if (!success) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }
  return res.status(200).json({ success: true, message: 'Item deleted' });
});
