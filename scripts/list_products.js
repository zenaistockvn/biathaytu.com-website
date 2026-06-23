const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log('--- PRODUCT LIST IN PRODUCTS.JSON ---');
products.forEach((p, index) => {
  console.log(`${index + 1}. ID: ${p.id} | Slug: ${p.slug}\n   Name: "${p.name}"\n   Price: ${p.price} | Category: ${p.category} | Volume: ${p.volume}\n`);
});
console.log('------------------------------------');
