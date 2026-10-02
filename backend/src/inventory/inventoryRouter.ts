import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';
import { MAX_PRICE_DEVIATION_PERCENT } from '@msme/shared';

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

    const newItem = store.addInventoryItem({
      name,
      nameMl: nameMl || name,
      category: category || 'General',
      categoryMl: categoryMl || 'സാധാരണ',
      currentStock: parseFloat(currentStock),
      unit: unit || 'kg',
      reorderLevel: reorderLevel ? parseFloat(reorderLevel) : 10,
      unitPrice: parseFloat(unitPrice),
      costPrice: costPrice ? parseFloat(costPrice) : parseFloat(unitPrice) * 0.8
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
      ...(name && { name }),
      ...(nameMl && { nameMl }),
      ...(category && { category }),
      ...(categoryMl && { categoryMl }),
      ...(currentStock !== undefined && { currentStock: parseFloat(currentStock) }),
      ...(unit && { unit }),
      ...(reorderLevel !== undefined && { reorderLevel: parseFloat(reorderLevel) }),
      ...(unitPrice !== undefined && { unitPrice: parseFloat(unitPrice) }),
      ...(costPrice !== undefined && { costPrice: parseFloat(costPrice) }),
      lastRestocked: 'Just now'
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
