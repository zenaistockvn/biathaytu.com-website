const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. Đọc DATABASE_URL từ file .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
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

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

if (process.env.ALLOW_DESTRUCTIVE_MIGRATION !== '1') {
  console.error('Refusing to run migrate-neon.js without ALLOW_DESTRUCTIVE_MIGRATION=1.');
  console.error('This script runs 001_init.sql, which drops and recreates core tables.');
  process.exit(1);
}

// Danh sách các file SQL migration theo thứ tự
const migrations = [
  { file: '001_init.sql', path: path.join(__dirname, '..', 'supabase', 'migrations', '001_init.sql') },
  { file: '002_fix_schema.sql', path: path.join(__dirname, '..', 'supabase', 'migrations', '002_fix_schema.sql') },
  { file: '003_fix_rls_policies.sql', path: path.join(__dirname, '..', 'supabase', 'migrations', '003_fix_rls_policies.sql') },
  { file: '20260416000000_update_social_accounts_unique.sql', path: path.join(__dirname, '..', 'supabase', 'migrations', '20260416000000_update_social_accounts_unique.sql') }
];

const seedPremiumFile = path.join(__dirname, '..', 'supabase', 'seed_30_premium.sql');

async function runMigration() {
  console.log('Connecting to Neon Database...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected successfully!');

    // 1. Tạo các role service_role và anon nếu chưa tồn tại
    console.log('Creating roles service_role and anon if not exists...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
          CREATE ROLE service_role;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
          CREATE ROLE anon;
        END IF;
      END $$;
    `);
    console.log('Roles check completed.');

    // 2. Chạy 001_init.sql
    console.log('----------------------------------------');
    console.log('Executing 001_init.sql...');
    const initSql = fs.readFileSync(migrations[0].path, 'utf8');
    await client.query(initSql);
    console.log('Success: 001_init.sql completed.');

    // 3. Bổ sung các cột bị thiếu của bảng products (đặc tả cho dự án Bia Thầy Tu)
    console.log('Altering products table to add missing schema fields...');
    await client.query(`
      ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS abv NUMERIC,
        ADD COLUMN IF NOT EXISTS ibu INT,
        ADD COLUMN IF NOT EXISTS volume TEXT,
        ADD COLUMN IF NOT EXISTS origin TEXT,
        ADD COLUMN IF NOT EXISTS brewing_method TEXT,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS haravan_url TEXT;
    `);
    console.log('Success: Altered products table.');

    // 4. Chạy các migrations còn lại
    for (let i = 1; i < migrations.length; i++) {
      const mig = migrations[i];
      console.log('----------------------------------------');
      console.log(`Executing ${mig.file}...`);
      const sqlContent = fs.readFileSync(mig.path, 'utf8');
      await client.query(sqlContent);
      console.log(`Success: ${mig.file} completed.`);
    }

    // 5. Chèn các sản phẩm mồi (dummy products) để thỏa mãn FK constraint cho seed_30_premium.sql
    console.log('----------------------------------------');
    console.log('Inserting dummy products for FK constraints...');
    await client.query(`
      INSERT INTO products (id, name, tenant_id) VALUES
        ('benediktiner-weissbier', 'Benediktiner Weissbier Dummy', 'demo-tenant'),
        ('bitburger-pilsner', 'Bitburger Pilsner Dummy', 'demo-tenant'),
        ('benediktiner-hell', 'Benediktiner Hell Dummy', 'demo-tenant'),
        ('benediktiner-dunkel', 'Benediktiner Dunkel Dummy', 'demo-tenant')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Success: Dummy products inserted.');

    // 6. Chạy seed_30_premium.sql
    console.log('----------------------------------------');
    console.log('Executing seed_30_premium.sql...');
    const seedSql = fs.readFileSync(seedPremiumFile, 'utf8');
    await client.query(seedSql);
    console.log('Success: seed_30_premium.sql completed.');

    // 7. Đồng bộ dữ liệu thực tế từ file JSON local (products.json, articles.json, promo_codes.json)
    console.log('----------------------------------------');
    console.log('Syncing products from products.json to Neon...');
    const productsJsonPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
    if (fs.existsSync(productsJsonPath)) {
      const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
      for (const p of products) {
        await client.query(`
          INSERT INTO products (
            id, name, description, price, category, usp, images, ai_analysis, 
            last_posted_at, tenant_id, created_at, updated_at, slug, abv, 
            ibu, volume, origin, brewing_method, is_featured, sort_order, haravan_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            category = EXCLUDED.category,
            usp = EXCLUDED.usp,
            images = EXCLUDED.images,
            ai_analysis = EXCLUDED.ai_analysis,
            last_posted_at = EXCLUDED.last_posted_at,
            tenant_id = EXCLUDED.tenant_id,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at,
            slug = EXCLUDED.slug,
            abv = EXCLUDED.abv,
            ibu = EXCLUDED.ibu,
            volume = EXCLUDED.volume,
            origin = EXCLUDED.origin,
            brewing_method = EXCLUDED.brewing_method,
            is_featured = EXCLUDED.is_featured,
            sort_order = EXCLUDED.sort_order,
            haravan_url = EXCLUDED.haravan_url;
        `, [
          p.id, p.name, p.description, p.price, p.category, p.usp, 
          JSON.stringify(p.images || []), JSON.stringify(p.ai_analysis || null),
          p.last_posted_at, p.tenant_id, p.created_at, p.updated_at, p.slug, p.abv,
          p.ibu, p.volume, p.origin, p.brewing_method, p.is_featured, p.sort_order, p.haravan_url
        ]);
      }
      console.log(`Synced ${products.length} products to database.`);
    }

    console.log('Syncing articles from articles.json to Neon...');
    const articlesJsonPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
    if (fs.existsSync(articlesJsonPath)) {
      const articles = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
      for (const a of articles) {
        await client.query(`
          INSERT INTO seo_articles (
            id, product_id, title, slug, content, meta_description, keywords, 
            word_count, micro_content_count, status, tenant_id, created_at
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
            created_at = EXCLUDED.created_at;
        `, [
          a.id, a.product_id, a.title, a.slug, a.content, a.meta_description,
          JSON.stringify(a.keywords || []), a.word_count, a.micro_content_count,
          a.status, a.tenant_id, a.created_at
        ]);
      }
      console.log(`Synced ${articles.length} articles to database.`);
    }

    console.log('Syncing promo codes from promo_codes.json to Neon...');
    const promoJsonPath = path.join(__dirname, '..', 'src', 'data', 'promo_codes.json');
    // Tạo bảng promo_codes nếu chưa có (vì 001_init.sql có thể chưa tạo)
    await client.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code TEXT PRIMARY KEY,
        discount_type TEXT NOT NULL,
        discount_value FLOAT NOT NULL,
        min_order_value FLOAT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    
    if (fs.existsSync(promoJsonPath)) {
      const promos = JSON.parse(fs.readFileSync(promoJsonPath, 'utf8'));
      for (const pr of promos) {
        await client.query(`
          INSERT INTO promo_codes (
            code, discount_type, discount_value, min_order_value, is_active, expires_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (code) DO UPDATE SET
            discount_type = EXCLUDED.discount_type,
            discount_value = EXCLUDED.discount_value,
            min_order_value = EXCLUDED.min_order_value,
            is_active = EXCLUDED.is_active,
            expires_at = EXCLUDED.expires_at;
        `, [
          pr.code, pr.discount_type, pr.discount_value, pr.min_order_value || 0,
          pr.is_active, pr.expires_at
        ]);
      }
      console.log(`Synced ${promos.length} promo codes to database.`);
    }

    console.log(`----------------------------------------`);
    console.log('ALL MIGRATIONS AND DUMP DATA SYNCED SUCCESSFULLY TO NEON!');
  } catch (err) {
    console.error('Migration failed with error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

