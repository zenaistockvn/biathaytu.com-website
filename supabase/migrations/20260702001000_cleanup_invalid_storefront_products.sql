-- Remove legacy/demo products that must not be published to the storefront.
-- Backups are kept in public backup tables before any destructive change.

CREATE TABLE IF NOT EXISTS storefront_invalid_products_backup_20260702 AS
SELECT now() AS backed_up_at, p.*
FROM products p
WHERE p.id IS NULL
  OR p.id = ''
  OR p.name IS NULL
  OR p.name = ''
  OR p.slug IS NULL
  OR p.slug = ''
  OR p.category IS NULL
  OR p.category = ''
  OR p.category NOT IN ('bia', 'vang', 'phu-kien');

CREATE TABLE IF NOT EXISTS generated_contents_invalid_products_backup_20260702 AS
SELECT now() AS backed_up_at, gc.*
FROM generated_contents gc
WHERE gc.product_id IN (
  SELECT p.id
  FROM products p
  WHERE p.id IS NULL
    OR p.id = ''
    OR p.name IS NULL
    OR p.name = ''
    OR p.slug IS NULL
    OR p.slug = ''
    OR p.category IS NULL
    OR p.category = ''
    OR p.category NOT IN ('bia', 'vang', 'phu-kien')
);

ALTER TABLE storefront_invalid_products_backup_20260702 ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contents_invalid_products_backup_20260702 ENABLE ROW LEVEL SECURITY;

UPDATE generated_contents
SET product_id = NULL
WHERE product_id IN (
  SELECT p.id
  FROM products p
  WHERE p.id IS NULL
    OR p.id = ''
    OR p.name IS NULL
    OR p.name = ''
    OR p.slug IS NULL
    OR p.slug = ''
    OR p.category IS NULL
    OR p.category = ''
    OR p.category NOT IN ('bia', 'vang', 'phu-kien')
);

DELETE FROM products
WHERE id IS NULL
  OR id = ''
  OR name IS NULL
  OR name = ''
  OR slug IS NULL
  OR slug = ''
  OR category IS NULL
  OR category = ''
  OR category NOT IN ('bia', 'vang', 'phu-kien');

ALTER TABLE products VALIDATE CONSTRAINT products_storefront_category_check;
