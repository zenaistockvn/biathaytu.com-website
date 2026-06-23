const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Cập nhật giá đề xuất từ PDF
const priceMap = [
  { name: 'Bitburger Premium Pils Football Edition 2026 — Két 24 Lon 500ml', price: 1150000 },
  { name: 'Bitburger Premium Pils — Thùng 12 Chai 330ml', price: 620000 },
  { name: 'Bitburger Premium Pils — Két 24 Lon 330ml', price: 850000 },
  { name: 'Bitburger Premium Pils Bom 5L', price: 790000 },
  { name: 'Köstritzer Schwarzbier Bom 5L', price: 850000 },
  { name: 'Benediktiner Naturtrüb — Thùng 12 Chai 500ml', price: 1090000 },
  { name: 'Benediktiner Dunkel — Thùng 12 Chai 500ml', price: 1090000 },
  { name: 'Benediktiner Naturtrüb — Két 24 Lon 500ml', price: 1550000 },
  { name: 'Benediktiner Dunkel — Két 24 Lon 500ml', price: 1550000 },
  { name: 'Benediktiner Naturtrüb — Thùng 12 Lon 500ml', price: 790000 },
  { name: 'Benediktiner Dunkel — Thùng 12 Lon 500ml', price: 790000 },
  { name: 'Benediktiner Naturtrüb Bom 5L', price: 990000 },
  { name: 'Benediktiner Festbier — Két 24 Lon 500ml', price: 1490000 },
  { name: 'Benediktiner Festbier Bom 5L', price: 950000 },
  { name: 'Benediktiner Mix 2 Vị — Thùng 12 Chai 500ml', price: 1090000 }
];

let updatedCount = 0;
products.forEach(p => {
  const match = priceMap.find(item => item.name.toLowerCase() === p.name.toLowerCase());
  if (match) {
    if (p.price !== match.price) {
      console.log(`Updating ${p.name}: ${p.price} -> ${match.price}`);
      p.price = match.price;
      updatedCount++;
    }
  } else {
    console.log(`No direct match for: ${p.name} (Current price: ${p.price})`);
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${updatedCount} product prices.`);
