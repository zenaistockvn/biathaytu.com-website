import { describe, expect, it } from 'vitest';
import { calculateOrderTotals, AUTO_DISCOUNT_THRESHOLD } from './pricing';
import type { Product } from '@/lib/data/products';
import type { PromoCode } from '@/lib/data/promo';
import type { ClientCartItem } from './types';

function makeProduct(id: string, price: number, name = 'Bia ' + id): Product {
  return {
    id, name, slug: id, description: null, abv: null, ibu: null, volume: null,
    images: null, price, haravan_url: null, category: 'bia', sort_order: 0,
    is_featured: false, origin: null, updated_at: null,
  };
}
const lookup = (id: string) =>
  ({ p1: makeProduct('p1', 100000), big: makeProduct('big', 3000000) } as Record<string, Product>)[id] ?? null;

describe('orders/pricing', () => {
  it('computes subtotal from server price, ignoring client price', () => {
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 1, quantity: 3 }];
    const t = calculateOrderTotals(items, lookup, null);
    expect(t.subTotal).toBe(300000);
    expect(t.items[0].price).toBe(100000);
  });

  it('applies 5% auto discount at/above the threshold', () => {
    const items: ClientCartItem[] = [{ id: 'big', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, null);
    expect(t.subTotal).toBe(3000000);
    expect(t.subTotal).toBeGreaterThanOrEqual(AUTO_DISCOUNT_THRESHOLD);
    expect(t.autoDiscount).toBe(150000);
    expect(t.totalPrice).toBe(2850000);
  });

  it('applies a percent promo on top of subtotal', () => {
    const promo: PromoCode = { code: 'VIP10', discount_type: 'percent', discount_value: 10, is_active: true };
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, promo);
    expect(t.promoDiscount).toBe(10000);
    expect(t.promoCode).toBe('VIP10');
  });

  it('ignores a promo whose min_order_value is not met', () => {
    const promo: PromoCode = { code: 'FREESHIP', discount_type: 'amount', discount_value: 30000, min_order_value: 500000, is_active: true };
    const items: ClientCartItem[] = [{ id: 'p1', name: 'x', image: '', price: 0, quantity: 1 }];
    const t = calculateOrderTotals(items, lookup, promo);
    expect(t.promoDiscount).toBe(0);
    expect(t.promoCode).toBeNull();
  });

  it('throws when a product is missing or has no price', () => {
    const items: ClientCartItem[] = [{ id: 'ghost', name: 'Ghost', image: '', price: 0, quantity: 1 }];
    expect(() => calculateOrderTotals(items, lookup, null)).toThrow();
  });
});
