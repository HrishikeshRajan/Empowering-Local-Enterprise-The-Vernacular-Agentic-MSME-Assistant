import { prisma } from '../backend/src/db.js';

async function main() {
  const businesses = await prisma.businessProfile.findMany();
  console.log('=== BUSINESS PROFILES (' + businesses.length + ') ===');
  businesses.forEach(b => console.log(`- ID: ${b.id} | Phone: "${b.phone}" | Name: "${b.businessName}"`));

  const items = await prisma.inventoryItem.findMany();
  console.log('\n=== INVENTORY ITEMS (' + items.length + ') ===');
  items.forEach(i => console.log(`- ID: ${i.id} | Name: "${i.name}" | Stock: ${i.currentStock} | Price: ${i.unitPrice} | BusinessId: ${i.businessId}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
