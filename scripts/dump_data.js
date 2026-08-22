const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;
const QUERY_TIMEOUT_MS = 30000;
const VALID_PRODUCT_CATEGORIES = ['bia', 'vang', 'phu-kien', 'xuc-xich'];
const PRODUCT_IMAGE_PLACEHOLDER = '/images/products/placeholder-product.svg';
const LEGACY_HARAVAN_IMAGE_HOST = ['product', 'hstatic', 'net'].join('.');

const LEGACY_IMAGE_FILENAME_MAP = {
  '37_96f13f655e1e4889a99e3a5ba481cef9_grande.jpg': PRODUCT_IMAGE_PLACEHOLDER,
  '39_a92d1e96ff494d00bacc4de70b3ba5ca_grande.jpg': PRODUCT_IMAGE_PLACEHOLDER,
  'riesling_auslese_a286249fbffb40c5b2ed798abe388ca2_grande.png':
    '/images/products/official/rappenhof/riesling_auslese_bottle.png',
  '6_343530997b684b809e3e2d570d7197c1_grande.png':
    '/images/products/official/thorle/kabinett_bottle.png',
  '48_b9080ea57a1740e480c7d8fbcd61bbf4_grande.jpg':
    '/images/products/official/thorle/austernkalk_magnum_bottle.jpg',
  '9_587336c129e1466391e80e0f5273bcb4_grande.png':
    '/images/products/official/thorle/riesling_750_bottle.png',
  'riesling_kabinett_2f5a9c2ff1874c91b3ee1765b6814e3e_grande.png':
    '/images/products/official/rappenhof/riesling_kabinett_bottle.png',
  '1_c3ac6d2d42134f4984a3145fc430d49b_grande.png':
    '/images/products/official/thorle/spatburgunder_bottle.png',
  'riesling_trocken_d50b8e7cdd8540f9a290fd83ea36ca75_grande.png':
    '/images/products/official/rappenhof/riesling_trocken_bottle.png',
  'benediktiner-natutrub-1_d6fbd33c3762488db373ec581fe72a85.png':
    '/images/products/official/benediktiner/benediktiner-natutrub-1_d6fbd33c3762488db373ec581fe72a85.png',
  'benediktiner-dunkel-1_13c8182e69d04b45942a07a157ccbb09.png':
    '/images/products/official/benediktiner/benediktiner-dunkel-1_13c8182e69d04b45942a07a157ccbb09.png',
  'benediktiner-12mix-0_61ad00ab3f694954a7e087f1e9a8d869.png': PRODUCT_IMAGE_PLACEHOLDER,
  '130_22efcb56465d471581d518a0ce0f1b3e.png': PRODUCT_IMAGE_PLACEHOLDER,
  '118_cdb208ef8c9e432586505d5cc0247e84.png': PRODUCT_IMAGE_PLACEHOLDER,
  'benediktiner-natutrub-bom-1_3cbfd80e556342fcbc59e5f701f3d3fe.png': PRODUCT_IMAGE_PLACEHOLDER,
  'benediktiner-natutrub-lon-1_a69ea226e5394f01aeca3efb96a3cfd9.png':
    '/images/products/official/benediktiner/benediktiner-natutrub-lon-1_a69ea226e5394f01aeca3efb96a3cfd9.png',
  '113_cbaf0be4ae9d4e8486a5e81de930bc46.png':
    '/images/products/official/benediktiner/113_cbaf0be4ae9d4e8486a5e81de930bc46.png',
  'ly-benediktiner-chinh-hang-1_16a95d30eaa24ad0a6df3dc4c82ec1d1.png': PRODUCT_IMAGE_PLACEHOLDER,
  '124_43ed2d310d7b45a6a7c3cd065e139b25.png':
    '/images/products/official/benediktiner/124_43ed2d310d7b45a6a7c3cd065e139b25.png',
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

function localizeLegacyProductImage(image) {
  if (typeof image !== 'string' || !image) return image;

  try {
    const parsed = new URL(image);
    if (parsed.hostname !== LEGACY_HARAVAN_IMAGE_HOST) return image;
    const filename = parsed.pathname.split('/').pop();
    return LEGACY_IMAGE_FILENAME_MAP[filename] || PRODUCT_IMAGE_PLACEHOLDER;
  } catch {
    return image;
  }
}

function localizeProductRows(rows) {
  return rows.map(product => ({
    ...product,
    images: Array.isArray(product.images)
      ? product.images.map(localizeLegacyProductImage)
      : product.images,
  }));
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
    console.log(`Fetched ${pResult.rows.length} storefront-ready products`);

    // 2. Fetch seo_articles
    console.log('Fetching articles...');
    const aResult = await client.query('SELECT * FROM seo_articles ORDER BY created_at DESC');
    console.log(`Fetched ${aResult.rows.length} articles`);

    // Save to files
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    writeJsonAtomic(path.join(dataDir, 'products.json'), localizeProductRows(pResult.rows));
    writeJsonAtomic(path.join(dataDir, 'articles.json'), aResult.rows);
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
