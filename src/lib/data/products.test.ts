import { describe, expect, it } from 'vitest';
import {
  getAllProducts,
  getProductBySlugOrId,
  getBeerProducts,
  getAccessories,
  getRelatedBeers,
  getProductsByCategory,
  getSausageProducts,
} from './products';

describe('data/products', () => {
  const storefrontCategories = ['bia', 'vang', 'phu-kien', 'xuc-xich'];

  it('returns only storefront-ready products sorted by sort_order ascending', () => {
    const all = getAllProducts();
    expect(all.length).toBeGreaterThan(0);
    expect(
      all.every(
        (product) =>
          product.id &&
          product.name &&
          product.slug &&
          storefrontCategories.includes(product.category ?? ''),
      ),
    ).toBe(true);
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

  it('returns The Wurst sausage products from the xuc-xich category', () => {
    const sausages = getSausageProducts();

    expect(sausages.map((product) => product.slug)).toEqual([
      'the-wurst-wiener-hun-khoi-500g',
      'the-wurst-thuringer-bratwurst-500g',
      'the-wurst-combo-cold-cut-150g',
    ]);
    expect(sausages.every((product) => product.category === 'xuc-xich')).toBe(true);
    expect(sausages.map((product) => product.price)).toEqual([139000, 139000, 99000]);
    expect(sausages.map((product) => product.volume)).toEqual([
      '500g/gói',
      '500g/gói',
      '150g/combo',
    ]);
    expect(
      sausages.every((product) =>
        product.images?.[0]?.startsWith('/images/products/the-wurst/'),
      ),
    ).toBe(true);
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
