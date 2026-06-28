const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;

// Chỉ đọc file .env.local nếu DATABASE_URL chưa có sẵn trong process.env (chạy ở local)
if (!databaseUrl) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
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

async function dump() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database successfully.');

    // 1. Fetch products
    console.log('Fetching products...');
    const pResult = await client.query('SELECT * FROM products ORDER BY sort_order ASC, created_at DESC');
    console.log(`Fetched ${pResult.rows.length} products`);

    // 2. Fetch seo_articles
    console.log('Fetching articles...');
    const aResult = await client.query('SELECT * FROM seo_articles ORDER BY created_at DESC');
    console.log(`Fetched ${aResult.rows.length} articles`);

    // 3. Fetch promo_codes
    console.log('Fetching promo_codes...');
    const prResult = await client.query('SELECT * FROM promo_codes');
    console.log(`Fetched ${prResult.rows.length} promo codes`);

    // Save to files
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(pResult.rows, null, 2), 'utf8');
    fs.writeFileSync(path.join(dataDir, 'articles.json'), JSON.stringify(aResult.rows, null, 2), 'utf8');
    fs.writeFileSync(path.join(dataDir, 'promo_codes.json'), JSON.stringify(prResult.rows || [], null, 2), 'utf8');
    console.log('Dump completed successfully!');
  } catch (err) {
    console.error('Failed to dump data:', err);
  } finally {
    await client.end();
  }
}

dump();

