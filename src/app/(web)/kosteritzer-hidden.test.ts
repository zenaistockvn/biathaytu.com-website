import { describe, it, expect } from 'vitest';
import { PRODUCTS, getVisibleProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';

describe('Cơ chế ẩn sản phẩm thiếu ảnh chính thức', () => {
  it('danh sách HIDDEN_PRODUCT_SLUGS chứa ít nhất 2 SKU Köstritzer', () => {
    expect(HIDDEN_PRODUCT_SLUGS.size).toBeGreaterThanOrEqual(2);
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      expect(slug).toMatch(/kosteritzer|kostritzer/i);
    }
  });

  it('getVisibleProducts() loại bỏ đúng tất cả sản phẩm trong HIDDEN_PRODUCT_SLUGS', () => {
    const visible = getVisibleProducts();
    for (const p of visible) {
      expect(HIDDEN_PRODUCT_SLUGS.has(p.slug)).toBe(false);
    }
  });

  it('sản phẩm bị ẩn vẫn tồn tại trong PRODUCTS với hidden: true', () => {
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      const p = PRODUCTS.find((x) => x.slug === slug);
      expect(p, `Sản phẩm ${slug} không tìm thấy trong PRODUCTS`).toBeTruthy();
      expect(p?.hidden).toBe(true);
    }
  });
});
