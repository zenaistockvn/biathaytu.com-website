-- Harden storefront data shape and read paths.
-- This migration is intentionally non-destructive: existing legacy rows are not deleted.

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_not_empty
  ON products (slug)
  WHERE slug IS NOT NULL AND slug <> '';

CREATE INDEX IF NOT EXISTS idx_products_storefront_category_sort
  ON products (category, sort_order, created_at DESC)
  WHERE slug IS NOT NULL
    AND slug <> ''
    AND category IN ('bia', 'vang', 'phu-kien');

CREATE INDEX IF NOT EXISTS idx_seo_articles_tenant_status_created
  ON seo_articles (tenant_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_promo_codes_active_expires
  ON promo_codes (is_active, expires_at);

CREATE INDEX IF NOT EXISTS idx_posts_product_id
  ON posts (product_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_storefront_category_check'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_storefront_category_check
      CHECK (
        category IS NULL
        OR category = ''
        OR category IN ('bia', 'vang', 'phu-kien')
      )
      NOT VALID;
  END IF;
END $$;
