const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;
const QUERY_TIMEOUT_MS = 30000;
const VALID_PRODUCT_CATEGORIES = ['bia', 'vang', 'phu-kien', 'xuc-xich'];
const OUT_OF_SCOPE_BEER_PATTERN =
  /(?:chimay|la[-\\s]*trappe|rochefort|bitburger|köstritzer|kostritzer|bia[-\\s]*b[iỉ])/i;
const RETAIL_PRICE_BY_SLUG = {
  'benediktiner-festbier-ket-24-lon-500ml': 1500000,
  'benediktiner-festbier-bom-5l': 920000,
  'benediktiner-naturtrub-thung-12-chai-500ml': 1080000,
  'benediktiner-dunkel-thung-12-chai-500ml': 1080000,
  'benediktiner-mix-2-v-thng-12-chai-500ml': 1080000,
  'benediktiner-naturtrub-thung-12-lon-500ml': 790000,
  'benediktiner-dunkel-thung-12-lon-500ml': 790000,
  'benediktiner-naturtrub-bom-5l': 960000,
  'benediktiner-naturtrub-ket-24-lon-500ml': 1590000,
  'benediktiner-dunkel-ket-24-lon-500ml': 1590000,
};

// Chỉ đọc file .env.local nếu DATABASE_URL chưa có sẵn trong process.env (chạy ở local)
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

async function dump() {
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

    // 1. Fetch products
    console.log('Fetching products...');
    const invalidProducts = await client.query(`
      SELECT id, name, slug, category
      FROM products
      WHERE id IS NULL
        OR id = ''
        OR name IS NULL
        OR name = ''
        OR slug IS NULL
        OR slug = ''
        OR category IS NULL
        OR category = ''
        OR category <> ALL($1::text[])
      ORDER BY created_at DESC NULLS LAST
    `, [VALID_PRODUCT_CATEGORIES]);
    if (invalidProducts.rows.length > 0) {
      console.warn(`Excluded ${invalidProducts.rows.length} non-storefront products from dump.`);
      console.warn(JSON.stringify(invalidProducts.rows.slice(0, 10), null, 2));
    }

    const pResult = await client.query(`
      SELECT *
      FROM products
      WHERE id IS NOT NULL
        AND id <> ''
        AND name IS NOT NULL
        AND name <> ''
        AND slug IS NOT NULL
        AND slug <> ''
        AND category = ANY($1::text[])
      ORDER BY sort_order ASC, created_at DESC
    `, [VALID_PRODUCT_CATEGORIES]);
    if (pResult.rows.length === 0) {
      throw new Error('No storefront-ready products found in database.');
    }
    const inScopeProducts = pResult.rows.filter(
      (product) =>
        product.category !== 'bia' ||
        product.name.toLowerCase().includes('benediktiner'),
    );
    console.log(
      `Fetched ${pResult.rows.length} storefront-ready products; keeping ${inScopeProducts.length} products in the Benediktiner beer scope.`,
    );

    // 2. Fetch seo_articles
    console.log('Fetching articles...');
    const aResult = await client.query('SELECT * FROM seo_articles ORDER BY created_at DESC');
    const inScopeArticles = aResult.rows.filter(
      (article) =>
        !OUT_OF_SCOPE_BEER_PATTERN.test(`${article.title ?? ''} ${article.slug ?? ''}`),
    );
    console.log(
      `Fetched ${aResult.rows.length} articles; keeping ${inScopeArticles.length} articles in the Benediktiner scope.`,
    );

    // Save to files
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const productsWithRetailPrices = inScopeProducts.map((product) => ({
      ...product,
      price: RETAIL_PRICE_BY_SLUG[product.slug] ?? product.price,
    }));

    writeJsonAtomic(path.join(dataDir, 'products.json'), productsWithRetailPrices);
    writeJsonAtomic(path.join(dataDir, 'articles.json'), inScopeArticles);
    console.log('Dump completed successfully!');
  } catch (err) {
    console.error('Failed to dump data:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

function writeJsonAtomic(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
}

dump();
