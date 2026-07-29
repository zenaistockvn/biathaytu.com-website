import { describe, it, expect } from 'vitest';
import { getAllProducts, getBeerProducts, getComboProducts, getProductsByCategory, getProductBySlugOrId } from '@/lib/data/products';

describe('phủ catalog', () => {
  it('mọi SKU bán được đều có trang chi tiết', () => {
    const orphans = getAllProducts().filter((p) => !getProductBySlugOrId(p.slug));
    expect(orphans).toEqual([]);
  });

  it('có đủ SKU theo nhóm để render trên /san-pham', () => {
    expect(getBeerProducts().length).toBeGreaterThanOrEqual(16); // 16 active (1 Köstritzer hidden)
    expect(getProductsByCategory('vang').length).toBe(9);
    expect(getComboProducts().length).toBe(2); // 2 active (1 Köstritzer combo hidden)
  });
});
