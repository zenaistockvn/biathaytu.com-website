const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. Read DATABASE_URL from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
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

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

// 2. Read local articles data
const articlesFilePath = path.join(__dirname, '../src/data/articles.json');
let articles = [];
try {
  articles = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
  console.log(`Loaded ${articles.length} articles from local articles.json`);
} catch (error) {
  console.error('Error reading local articles.json:', error);
  process.exit(1);
}

async function sync() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database successfully.');

    let successCount = 0;

    for (const article of articles) {
      // Ensure keywords is serialized to JSON string for JSONB column
      const keywordsJson = JSON.stringify(article.keywords || []);

      const query = `
        INSERT INTO seo_articles (
          id, product_id, title, slug, content, meta_description, 
          keywords, word_count, micro_content_count, status, tenant_id, thumbnail_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          content = EXCLUDED.content,
          meta_description = EXCLUDED.meta_description,
          keywords = EXCLUDED.keywords,
          word_count = EXCLUDED.word_count,
          micro_content_count = EXCLUDED.micro_content_count,
          status = EXCLUDED.status,
          tenant_id = EXCLUDED.tenant_id,
          thumbnail_url = EXCLUDED.thumbnail_url;
      `;

      const values = [
        article.id,
        article.product_id || null,
        article.title,
        article.slug || null,
        article.content,
        article.meta_description || null,
        keywordsJson,
        article.word_count || 0,
        article.micro_content_count || 0,
        article.status || 'draft',
        article.tenant_id,
        article.thumbnail_url || null
      ];

      await client.query(query, values);
      successCount++;
    }

    console.log(`Successfully synchronized ${successCount} articles to Neon Database.`);
  } catch (error) {
    console.error('Error synchronizing articles to database:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

sync();
