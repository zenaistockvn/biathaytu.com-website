const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'DATABASE_URL') {
        databaseUrl = val;
      }
    }
  });
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found');
  process.exit(1);
}

const updates = [
  {
    slug: 'phan-biet-bia-thay-tu-trappist-va-bia-tu-vien',
    thumbnail: '/images/articles/phan-biet-bia-thay-tu.png'
  },
  {
    slug: 'mua-bia-thay-tu-chimay-la-trappe-o-dau-chinh-hang-ha-noi',
    thumbnail: '/images/articles/mua-bia-thay-tu-chimay.png'
  }
];

async function run() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    for (const item of updates) {
      const res = await client.query(
        "UPDATE seo_articles SET thumbnail_url = $1 WHERE slug = $2 RETURNING id",
        [item.thumbnail, item.slug]
      );
      if (res.rows.length > 0) {
        console.log(`Updated thumbnail for slug "${item.slug}" to "${item.thumbnail}"`);
      } else {
        console.warn(`Article not found in DB with slug: "${item.slug}"`);
      }
    }
  } catch (err) {
    console.error('Error updating thumbnails:', err);
  } finally {
    await client.end();
  }
}

run();
