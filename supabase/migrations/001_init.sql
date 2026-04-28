-- AMC Database Schema (idempotent — safe to re-run)
-- Run this in Supabase SQL Editor

-- Drop existing tables (cascade) to start fresh
DROP TABLE IF EXISTS post_analytics CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS generated_contents CASCADE;
DROP TABLE IF EXISTS content_templates CASCADE;
DROP TABLE IF EXISTS schedule_rules CASCADE;
DROP TABLE IF EXISTS social_accounts CASCADE;
DROP TABLE IF EXISTS brand_settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- 1. Tenants
CREATE TABLE tenants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'editor',
  tenant_id TEXT REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  price FLOAT,
  category TEXT,
  usp TEXT,
  images JSONB DEFAULT '[]',
  ai_analysis JSONB,
  last_posted_at TIMESTAMPTZ,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Brand Settings
CREATE TABLE brand_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id TEXT UNIQUE NOT NULL REFERENCES tenants(id),
  brand_name TEXT NOT NULL,
  brand_voice TEXT NOT NULL,
  colors JSONB,
  hashtags JSONB,
  logo_url TEXT
);

-- 5. Content Templates
CREATE TABLE content_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  platforms JSONB DEFAULT '["facebook","instagram"]',
  best_time_slots JSONB,
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Schedule Rules
CREATE TABLE schedule_rules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  days_of_week JSONB DEFAULT '[1,2,3,4,5]',
  rotation TEXT DEFAULT 'round_robin',
  is_active BOOLEAN DEFAULT true,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Generated Contents
CREATE TABLE generated_contents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  caption TEXT NOT NULL,
  hashtags TEXT,
  image_urls JSONB DEFAULT '[]',
  ai_score FLOAT,
  status TEXT DEFAULT 'draft',
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Posts
CREATE TABLE posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT REFERENCES products(id),
  platform TEXT NOT NULL,
  caption TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  external_id TEXT,
  error_log TEXT,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Social Accounts
CREATE TABLE social_accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Post Analytics
CREATE TABLE post_analytics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT UNIQUE NOT NULL REFERENCES posts(id),
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  reach INT DEFAULT 0,
  engagement FLOAT DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_posts_tenant_status ON posts(tenant_id, status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_rules_tenant ON schedule_rules(tenant_id);

-- Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role full access" ON tenants FOR ALL USING (true);
CREATE POLICY "Service role full access" ON products FOR ALL USING (true);
CREATE POLICY "Service role full access" ON posts FOR ALL USING (true);
CREATE POLICY "Service role full access" ON schedule_rules FOR ALL USING (true);
CREATE POLICY "Service role full access" ON brand_settings FOR ALL USING (true);

-- Seed demo data
INSERT INTO tenants (id, name, slug, plan) VALUES
  ('demo-tenant', 'Demo Brewery', 'demo-brewery', 'pro');

INSERT INTO brand_settings (tenant_id, brand_name, brand_voice, colors, hashtags) VALUES
  ('demo-tenant', 'Premium Beer Import',
   'Sang trọng nhưng không xa cách, đam mê bia thủ công, truyền cảm hứng khám phá hương vị mới.',
   '{"primary": "#D4A72C", "secondary": "#1A1A2E"}',
   '["BiaNhapKhau", "BiaThủCông", "CraftBeer", "BiaDuc", "PremiumBeer"]');

INSERT INTO products (name, description, price, category, usp, tenant_id) VALUES
  ('Paulaner Hefe-Weißbier', 'Bia lúa mì Đức truyền thống, vị tươi mát với hương chuối và đinh hương nhẹ. 500ml, 5.5% ABV.', 89000, 'F&B', 'Công thức 400 năm từ Munich', 'demo-tenant'),
  ('Erdinger Weissbier', 'Bia lúa mì Đức cao cấp, hương trái cây tự nhiên, mượt mà. 500ml, 5.3% ABV.', 85000, 'F&B', 'Bia lúa mì bán chạy nhất thế giới', 'demo-tenant'),
  ('Chimay Blue', 'Bia Abbey Bỉ, vị đậm đà phức tạp với hương mận chín và chocolate đen. 330ml, 9% ABV.', 150000, 'F&B', 'Nấu bởi tu sĩ Trappist từ 1862', 'demo-tenant'),
  ('Hoegaarden White', 'Bia trắng Bỉ, thanh mát với vỏ cam Curaçao và hạt rau mùi. 330ml, 4.9% ABV.', 55000, 'F&B', 'Bia trắng nổi tiếng nhất thế giới', 'demo-tenant');

INSERT INTO schedule_rules (name, time, platform, content_type, days_of_week, tenant_id) VALUES
  ('Sáng FB Tips', '08:00', 'facebook', 'tips', '[1,2,3,4,5]', 'demo-tenant'),
  ('Trưa IG Showcase', '11:30', 'instagram', 'product_intro', '[1,2,3,4,5]', 'demo-tenant'),
  ('Chiều FB Promo', '18:00', 'facebook', 'promotion', '[1,2,3,4,5,6]', 'demo-tenant'),
  ('Tối TikTok', '20:00', 'tiktok', 'viral', '[1,3,5]', 'demo-tenant');
