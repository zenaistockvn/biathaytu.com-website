import { describe, it, expect } from 'vitest';
import { getAllProducts, getVisibleProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';

describe('Cơ chế ẩn sản phẩm thiếu ảnh chính thức', () => {
  it('HIDDEN_PRODUCT_SLUGS chỉ chứa SKU Köstritzer đang chờ ảnh chính hãng', () => {
    expect(HIDDEN_PRODUCT_SLUGS.size).toBe(2);
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      expect(slug).toMatch(/kostritzer/i);
      expect(slug).not.toMatch(/kosteritzer/i);
    }
  });

  it('getVisibleProducts() loại bỏ đúng tất cả sản phẩm trong HIDDEN_PRODUCT_SLUGS', () => {
    const visible = getVisibleProducts();
    for (const p of visible) {
      expect(HIDDEN_PRODUCT_SLUGS.has(p.slug)).toBe(false);
    }
  });

  it('sản phẩm bị ẩn vẫn tồn tại trong getAllProducts() với hidden: true', () => {
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      const p = getAllProducts().find((x) => x.slug === slug);
      expect(p, `Sản phẩm ${slug} không tìm thấy trong getAllProducts()`).toBeTruthy();
      expect(p?.hidden).toBe(true);
    }
  });
});
