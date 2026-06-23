import { describe, expect, it } from 'vitest';
import { getPriceRange } from './productPricing';

describe('seo/productPricing', () => {
  it('aggregates the Naturtrüb product line price range', () => {
    const range = getPriceRange((p) => p.name.includes('Naturtrüb'));
    expect(range).not.toBeNull();
    expect(range!.lowPrice).toBe(790000);
    expect(range!.highPrice).toBe(1550000);
    expect(range!.offerCount).toBeGreaterThanOrEqual(3);
  });

  it('ignores products without a numeric price', () => {
    // "Bitburger Premium Pils" (slug bitburger-premium-pils) có price=null phải bị bỏ
    const range = getPriceRange((p) => p.name.includes('Bitburger'));
    expect(range).not.toBeNull();
    expect(range!.lowPrice).toBeGreaterThan(0);
    expect(range!.lowPrice).toBeLessThanOrEqual(range!.highPrice);
  });

  it('returns null when nothing matches', () => {
    expect(getPriceRange(() => false)).toBeNull();
  });
});
