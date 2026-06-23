import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlugOrId,
  getBeerProducts,
  getAccessories,
  getRelatedBeers,
  getProductsByCategory,
} from './products';

describe('data/products', () => {
  it('returns all products sorted by sort_order ascending', () => {
    const all = getAllProducts();
    expect(all.length).toBeGreaterThan(0);
    for (let i = 1; i < all.length; i++) {
      expect(all[i].sort_order ?? 0).toBeGreaterThanOrEqual(all[i - 1].sort_order ?? 0);
    }
  });

  it('finds a product by slug or by id', () => {
    const first = getAllProducts().find((p) => p.slug);
    expect(first).toBeTruthy();
    expect(getProductBySlugOrId(first!.slug)?.id).toBe(first!.id);
    expect(getProductBySlugOrId(first!.id)?.id).toBe(first!.id);
    expect(getProductBySlugOrId('khong-ton-tai-xyz')).toBeNull();
  });

  it('getBeerProducts can exclude Bitburger', () => {
    const beers = getBeerProducts({ excludeBitburger: true });
    expect(beers.every((p) => p.category === 'bia')).toBe(true);
    expect(beers.every((p) => !p.name.toLowerCase().includes('bitburger'))).toBe(true);
  });

  it('getRelatedBeers excludes the current product and caps the limit', () => {
    const anyBeer = getBeerProducts()[0];
    const related = getRelatedBeers(anyBeer.id, 4);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.every((p) => p.id !== anyBeer.id)).toBe(true);
  });

  it('getAccessories and getProductsByCategory filter by category', () => {
    expect(getAccessories().every((p) => p.category === 'phu-kien')).toBe(true);
    expect(getProductsByCategory('bia').every((p) => p.category === 'bia')).toBe(true);
  });
});
