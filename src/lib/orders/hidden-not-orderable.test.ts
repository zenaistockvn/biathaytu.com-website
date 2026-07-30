import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from './pricing';
import { getAllProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';
import { lookupOrderableProduct } from './productLookup';

describe('SKU ẩn không được đặt hàng', () => {
  it('lookupOrderableProduct trả null cho SKU ẩn', () => {
    for (const slug of HIDDEN_PRODUCT_SLUGS) {
      expect(lookupOrderableProduct(slug), `${slug} vẫn tra được`).toBeNull();
    }
  });

  it('calculateOrderTotals ném lỗi khi giỏ chứa SKU ẩn', () => {
    const hidden = getAllProducts().find((p) => HIDDEN_PRODUCT_SLUGS.has(p.slug))!;
    expect(() =>
      calculateOrderTotals(
        [{ id: hidden.id, name: hidden.name, image: '', price: 1, quantity: 1 }],
        lookupOrderableProduct,
        null,
      ),
    ).toThrow();
  });

  it('SKU đang bán vẫn tra được bình thường', () => {
    const visible = getAllProducts().find((p) => !HIDDEN_PRODUCT_SLUGS.has(p.slug) && p.price)!;
    expect(lookupOrderableProduct(visible.id)?.id).toBe(visible.id);
  });
});
