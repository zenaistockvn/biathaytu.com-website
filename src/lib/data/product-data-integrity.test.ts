import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { getAllProducts } from './products';

const KOSTRITZER_RE = /k(ö|o)strit?zer/i;
const BITBURGER_IMAGE_RE = /bitb|bitburger/i;
const LEGACY_HARAVAN_IMAGE_HOST = ['product', 'hstatic', 'net'].join('.');

describe('toàn vẹn dữ liệu sản phẩm', () => {
  it('KHÔNG có SKU nào dùng ảnh của thương hiệu khác', () => {
    const wrongBrand = getAllProducts()
      .filter((p) => KOSTRITZER_RE.test(p.name))
      .flatMap((p) => (p.images ?? []).map((img) => `${p.slug} → ${img}`))
      .filter((pair) => {
        const imgPath = pair.split('→')[1].trim();
        const filename = imgPath.split('/').pop() || '';
        return BITBURGER_IMAGE_RE.test(filename);
      });
    expect(wrongBrand).toEqual([]);
  });

  it('localProducts.ts chỉ chứa SKU do người thật thêm — không có SKU Köstritzer tự sinh', () => {
    const invented = LOCAL_STOREFRONT_PRODUCTS
      .filter((p) => KOSTRITZER_RE.test(p.name) && p.category === 'bia')
      .map((p) => p.slug);
    expect(invented).toEqual([]);
  });

  it('không có slug nào sai chính tả "kosteritzer"', () => {
    const typos = getAllProducts().map((p) => p.slug).filter((s) => /kosteritzer/i.test(s));
    expect(typos).toEqual([]);
  });

  it('products.json không còn phụ thuộc ảnh CDN Haravan cũ', () => {
    expect(JSON.stringify(productsData)).not.toContain(LEGACY_HARAVAN_IMAGE_HOST);
  });

  it('runtime product data không trả ảnh CDN Haravan cũ', () => {
    const legacyImages = getAllProducts()
      .flatMap((product) => product.images ?? [])
      .filter((image) => image.includes(LEGACY_HARAVAN_IMAGE_HOST));
    expect(legacyImages).toEqual([]);
  });

  it('next/image không còn whitelist CDN Haravan cũ', () => {
    const nextConfig = readFileSync(join(process.cwd(), 'next.config.js'), 'utf8');
    expect(nextConfig).not.toContain(LEGACY_HARAVAN_IMAGE_HOST);
  });

  it('products.json giữ nguyên ảnh gốc của SKU Köstritzer (artifact sinh từ DB)', () => {
    const sku = (productsData as Array<{ slug: string; images: string[] | null }>)
      .find((p) => p.slug === 'kostritzer-schwarzbier-bom-5l');
    expect(sku, 'thiếu SKU kostritzer-schwarzbier-bom-5l trong products.json').toBeTruthy();
    expect(sku!.images?.[0]).toBe('/images/products/official/bitburger/kostritzer_keg.png');
  });
});
