import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';
import { prisma } from '../db.js';
import { resolveSessionFromAuthHeader } from '../auth/authRouter.js';
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
 * Helper to resolve the active BusinessProfile from auth header or store profile
 */
async function resolveActiveBusiness(req: Request) {
  const session = resolveSessionFromAuthHeader(req.headers.authorization);
  const phone = session?.phone || store.getProfile()?.phone;
  let business = await prisma.businessProfile.findFirst({
    where: phone ? { phone } : undefined
  });
  if (!business) {
    business = await prisma.businessProfile.findFirst();
  }
  return business;
}

/**
 * GET /api/inventory
 * Return full inventory stock list directly synced with PostgreSQL database
 */
inventoryRouter.get('/', async (req: Request, res: Response) => {
  try {
    const business = await resolveActiveBusiness(req);

    if (business) {
      let dbItems = await prisma.inventoryItem.findMany({
        where: { businessId: business.id },
        orderBy: { name: 'asc' }
      });

      // Auto-seed initial stock items into PostgreSQL if this business has 0 items
      if (dbItems.length === 0) {
        const initialItems = store.getInventory();
        for (const item of initialItems) {
          try {
            await prisma.inventoryItem.create({
              data: {
                businessId: business.id,
                name: item.name,
                nameMl: item.nameMl || item.name,
                category: item.category || 'General',
                categoryMl: item.categoryMl || 'സാധാരണ',
                currentStock: item.currentStock,
                unit: item.unit || 'kg',
                reorderLevel: item.reorderLevel || 10,
                unitPrice: item.unitPrice || 50,
                costPrice: item.costPrice || 40
              }
            });
          } catch (seedErr) {
            console.error(`[Inventory Router] Seeding item "${item.name}" notice:`, seedErr);
          }
        }

        dbItems = await prisma.inventoryItem.findMany({
          where: { businessId: business.id },
          orderBy: { name: 'asc' }
        });
        console.log(`[Inventory Router] Auto-seeded ${dbItems.length} items in PostgreSQL for business "${business.businessName}"`);
      }

      const formatted = dbItems.map(i => ({
        id: i.id,
        name: i.name,
        nameMl: i.nameMl,
        category: i.category,
        categoryMl: i.categoryMl,
        currentStock: i.currentStock,
        unit: i.unit,
        reorderLevel: i.reorderLevel,
        unitPrice: i.unitPrice,
        costPrice: i.costPrice,
        lastRestocked: i.lastRestocked 
          ? new Date(i.lastRestocked).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Recently'
      }));

      return res.status(200).json(formatted);
    }
  } catch (dbErr) {
    console.error('[Inventory Router] PostgreSQL query error, serving local store cache:', dbErr);
  }

  const items = store.getInventory();
  return res.status(200).json(items);
});

/**
 * GET /api/inventory/alerts
 * Return low-stock items that need reordering
 */
inventoryRouter.get('/alerts', async (req: Request, res: Response) => {
  try {
    const business = await resolveActiveBusiness(req);
    if (business) {
      const dbItems = await prisma.inventoryItem.findMany({
        where: { businessId: business.id }
      });
      const lowStock = dbItems.filter(item => item.currentStock <= item.reorderLevel);
      return res.status(200).json({
        count: lowStock.length,
        items: lowStock
      });
    }
  } catch (err) {
    console.warn('[Inventory Router] Low-stock alert query notice:', err);
  }

  const items = store.getInventory();
  const lowStock = items.filter(item => item.currentStock <= item.reorderLevel);
  return res.status(200).json({
    count: lowStock.length,
    items: lowStock
  });
});

/**
 * POST /api/inventory
 * Add a new inventory item to both local store and PostgreSQL database
 */
inventoryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, nameMl, category, categoryMl, currentStock, unit, reorderLevel, unitPrice, costPrice } = req.body;

    if (!name || currentStock === undefined || unitPrice === undefined) {
      return res.status(400).json({ error: 'name, currentStock, and unitPrice are required' });
    }

    const stockCheck = requireFloat(currentStock, 'currentStock');
    const priceCheck = requireFloat(unitPrice, 'unitPrice');
    if (!stockCheck.ok) return res.status(400).json({ error: stockCheck.error });
    if (!priceCheck.ok) return res.status(400).json({ error: priceCheck.error });

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

    // Persist to PostgreSQL
    let dbError: string | undefined;
    try {
      const business = await resolveActiveBusiness(req);
      if (business) {
        const dbCreated = await prisma.inventoryItem.create({
          data: {
            businessId: business.id,
            name: newItem.name,
            nameMl: newItem.nameMl,
            category: newItem.category,
            categoryMl: newItem.categoryMl,
            currentStock: newItem.currentStock,
            unit: newItem.unit,
            reorderLevel: newItem.reorderLevel,
            unitPrice: newItem.unitPrice,
            costPrice: newItem.costPrice
          }
        });
        newItem.id = dbCreated.id;
        console.log(`[Inventory Router] Successfully created "${newItem.name}" in PostgreSQL (ID: ${dbCreated.id})`);
      }
    } catch (pgErr: any) {
      dbError = pgErr?.message || String(pgErr);
      console.error('[Inventory Router] PostgreSQL create error:', dbError);
    }

    return res.status(201).json({
      ...newItem,
      ...(dbError && { databaseError: dbError })
    });
  } catch (error: any) {
    console.error('[Inventory Router] Failed to add item:', error);
    return res.status(500).json({ error: error.message || 'Failed to add item' });
  }
});

/**
 * PUT /api/inventory/:id
 * Update an existing inventory item in store and PostgreSQL
 */
inventoryRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = store.getInventoryItem(id);
    const { name, nameMl, category, categoryMl, currentStock, unit, reorderLevel, unitPrice, costPrice } = req.body;

    let guardrailWarning: string | null = null;
    const basePrice = existing?.unitPrice || 0;
    if (unitPrice !== undefined && basePrice > 0) {
      const priceVal = parseFloat(unitPrice);
      const percentChange = Math.abs(priceVal - basePrice) / basePrice * 100;
      if (percentChange > MAX_PRICE_DEVIATION_PERCENT) {
        guardrailWarning = `Price changed by ${percentChange.toFixed(1)}% (exceeds ${MAX_PRICE_DEVIATION_PERCENT}% safety guardrail)`;
      }
    }

    const updated = store.updateInventoryItem(id, {
      ...(name && { name: String(name).slice(0, 120) }),
      ...(nameMl && { nameMl: String(nameMl).slice(0, 120) }),
      ...(category && { category: String(category).slice(0, 60) }),
      ...(categoryMl && { categoryMl: String(categoryMl).slice(0, 60) }),
      ...(currentStock !== undefined && { currentStock: safeFloat(currentStock) ?? (existing?.currentStock || 0) }),
      ...(unit && { unit: String(unit).slice(0, 20) }),
      ...(reorderLevel !== undefined && { reorderLevel: safeFloat(reorderLevel) ?? (existing?.reorderLevel || 10) }),
      ...(unitPrice !== undefined && { unitPrice: safeFloat(unitPrice) ?? (existing?.unitPrice || 0) }),
      ...(costPrice !== undefined && { costPrice: safeFloat(costPrice) ?? (existing?.costPrice || 0) }),
      lastRestocked: 'Just now',
    });

    // Update in PostgreSQL
    let dbError: string | undefined;
    try {
      const business = await resolveActiveBusiness(req);
      if (business) {
        const dbItem = await prisma.inventoryItem.findFirst({
          where: {
            businessId: business.id,
            OR: [
              { id },
              { name: existing?.name || name }
            ]
          }
        });
        if (dbItem) {
          await prisma.inventoryItem.update({
            where: { id: dbItem.id },
            data: {
              ...(name && { name }),
              ...(nameMl && { nameMl }),
              ...(currentStock !== undefined && { currentStock: safeFloat(currentStock) }),
              ...(unitPrice !== undefined && { unitPrice: safeFloat(unitPrice) }),
              lastRestocked: new Date(),
              updatedAt: new Date()
            }
          });
          console.log(`[Inventory Router] Updated "${dbItem.name}" in PostgreSQL`);
        }
      }
    } catch (pgErr: any) {
      dbError = pgErr?.message || String(pgErr);
      console.error('[Inventory Router] PostgreSQL update error:', dbError);
    }

    return res.status(200).json({
      item: updated || { id, ...req.body },
      warning: guardrailWarning,
      ...(dbError && { databaseError: dbError })
    });
  } catch (error: any) {
    console.error('[Inventory Router] Failed to update item:', error);
    return res.status(500).json({ error: error.message || 'Failed to update item' });
  }
});
