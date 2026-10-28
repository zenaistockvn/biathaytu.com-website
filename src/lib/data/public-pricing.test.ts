import { describe, expect, it } from 'vitest';
import { getAllProducts, getVisibleProducts, getProductBySlugOrId } from './products';

describe('distribution catalog pricing', () => {
  it('does not expose internal prices through public product data', () => {
    expect(getVisibleProducts().length).toBeGreaterThan(0);
    for (const product of getAllProducts()) {
      expect(product.price, product.slug).toBeNull();
      expect(getProductBySlugOrId(product.slug)?.price).toBeNull();
    }
  });
});
