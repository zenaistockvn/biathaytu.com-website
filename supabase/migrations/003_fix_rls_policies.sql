-- Migration 003: Fix RLS Policies — Proper tenant-based access control
--
-- Problem: All tables had `USING (true)` which grants full access to anyone
-- with the anon key. This migration replaces those with proper policies.
--
-- Strategy:
--   - Anon key: READ-ONLY access (for SSR/client data fetching)
--   - Service role: FULL access (for API routes, cron jobs)
--   - Write operations MUST go through API routes (service_role)

-- ═══════════════════════════════════════════════════════════════
-- 1. Drop all permissive "Service role full access" policies
-- ═══════════════════════════════════════════════════════════════

DO $$ 
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN (
      'tenants', 'products', 'posts', 'schedule_rules', 'brand_settings',
      'seo_articles', 'image_prompts', 'brand_dna', 'ad_platform_specs',
      'ad_angles', 'content_tips', 'generated_contents', 'social_accounts',
      'post_analytics', 'content_templates', 'users'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Service role full access" ON %I', tbl.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "anon_read" ON %I', tbl.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "service_role_all" ON %I', tbl.tablename);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- 2. Enable RLS on all tables (idempotent)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_platform_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_angles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tips ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- 3. Service Role — FULL access (for API routes + cron)
-- ═══════════════════════════════════════════════════════════════
-- service_role bypasses RLS by default in Supabase, but we add
-- explicit policies for clarity and documentation.

CREATE POLICY "service_role_all" ON tenants FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON users FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON products FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON brand_settings FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON content_templates FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON schedule_rules FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON generated_contents FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON posts FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON social_accounts FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON post_analytics FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON seo_articles FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON image_prompts FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON brand_dna FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON ad_platform_specs FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON ad_angles FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all" ON content_tips FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 4. Anon Role — READ-ONLY on public data tables
-- ═══════════════════════════════════════════════════════════════
-- Only allow SELECT (no INSERT/UPDATE/DELETE via anon key)

CREATE POLICY "anon_read" ON products FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON brand_settings FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON schedule_rules FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON generated_contents FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON posts FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON seo_articles FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON image_prompts FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON brand_dna FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON ad_platform_specs FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON ad_angles FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON content_tips FOR SELECT
  TO anon USING (true);

CREATE POLICY "anon_read" ON post_analytics FOR SELECT
  TO anon USING (true);

-- ═══════════════════════════════════════════════════════════════
-- 5. Sensitive tables — NO anon access at all
-- ═══════════════════════════════════════════════════════════════
-- social_accounts contains access tokens — service_role only
-- users/tenants are admin tables — service_role only
-- (No anon policies = no access for anon role)
