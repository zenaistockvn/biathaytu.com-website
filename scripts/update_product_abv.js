const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;
const QUERY_TIMEOUT_MS = 30000;

// Read .env.local if DATABASE_URL is not set in process.env
if (!databaseUrl) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'DATABASE_URL') {
          databaseUrl = val;
        }
      }
    });
  }
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

async function updateAbv() {
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: QUERY_TIMEOUT_MS,
    query_timeout: QUERY_TIMEOUT_MS,
    statement_timeout: QUERY_TIMEOUT_MS,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database successfully.');

    // Start Transaction
    await client.query('BEGIN');

    // 1. Benediktiner Weissbier/Naturtrüb and Mix products -> 5.4
    const res1 = await client.query(`
      UPDATE products
      SET abv = 5.4
      WHERE category = 'bia'
        AND (
          name ILIKE '%Benediktiner Weissbier%'
          OR name ILIKE '%Benediktiner Naturtrüb%'
          OR name ILIKE '%Benediktiner Naturtrub%'
          OR name ILIKE '%Benediktiner Mix%'
        )
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res1.rowCount} Benediktiner Weissbier/Naturtrüb & Mix products to 5.4 ABV.`);
    res1.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // 2. Benediktiner Dunkel -> 5.4
    const res2 = await client.query(`
      UPDATE products
      SET abv = 5.4
      WHERE category = 'bia'
        AND name ILIKE '%Benediktiner Dunkel%'
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res2.rowCount} Benediktiner Dunkel products to 5.4 ABV.`);
    res2.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // 3. Benediktiner Festbier -> 5.8
    const res3 = await client.query(`
      UPDATE products
      SET abv = 5.8
      WHERE category = 'bia'
        AND name ILIKE '%Benediktiner Festbier%'
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res3.rowCount} Benediktiner Festbier products to 5.8 ABV.`);
    res3.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // 4. Bitburger Premium Pils -> 4.8
    const res4 = await client.query(`
      UPDATE products
      SET abv = 4.8
      WHERE category = 'bia'
        AND name ILIKE '%Bitburger Premium Pils%'
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res4.rowCount} Bitburger Premium Pils products to 4.8 ABV.`);
    res4.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // 5. Köstritzer Schwarzbier -> 4.8
    const res5 = await client.query(`
      UPDATE products
      SET abv = 4.8
      WHERE category = 'bia'
        AND (name ILIKE '%Köstritzer Schwarzbier%' OR name ILIKE '%Kostritzer Schwarzbier%')
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res5.rowCount} Köstritzer Schwarzbier products to 4.8 ABV.`);
    res5.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // 6. Accessories (category 'phu-kien') -> NULL
    const res6 = await client.query(`
      UPDATE products
      SET abv = NULL
      WHERE category = 'phu-kien'
      RETURNING id, name, category, abv;
    `);
    console.log(`Updated ${res6.rowCount} Accessory products to NULL ABV.`);
    res6.rows.forEach(r => console.log(` - [${r.id}] ${r.name} -> ABV: ${r.abv}`));

    // Commit Transaction
    await client.query('COMMIT');
    console.log('Transaction committed successfully.');

  } catch (err) {
    console.error('Failed to update product ABV:', err);
    try {
      await client.query('ROLLBACK');
      console.log('Transaction rolled back.');
    } catch (rollbackErr) {
      console.error('Failed to rollback transaction:', rollbackErr);
    }
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

updateAbv();
