import { describe, it, expect } from 'vitest';
import productsData from '@/data/products.json';
import { LOCAL_STOREFRONT_PRODUCTS } from './localProducts';
import { getAllProducts } from './products';

const KOSTRITZER_RE = /k(ö|o)strit?zer/i;
const BITBURGER_IMAGE_RE = /bitb|bitburger/i;

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

  it('products.json giữ nguyên ảnh gốc của SKU Köstritzer (artifact sinh từ DB)', () => {
    const sku = (productsData as Array<{ slug: string; images: string[] | null }>)
      .find((p) => p.slug === 'kostritzer-schwarzbier-bom-5l');
    expect(sku, 'thiếu SKU kostritzer-schwarzbier-bom-5l trong products.json').toBeTruthy();
    expect(sku!.images?.[0]).toBe('/images/products/official/bitburger/kostritzer_keg.png');
  });
});
