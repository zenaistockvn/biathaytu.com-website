import { describe, expect, it } from 'vitest';
import { validateOrderInput, MAX_QUANTITY_PER_ITEM } from './validation';
import type { ClientCartItem, OrderCustomer } from './types';

const okCustomer: OrderCustomer = {
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  address: '1 Đội Cấn, Hà Nội',
};
const okItems: ClientCartItem[] = [
  { id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2 },
];

describe('orders/validation', () => {
  it('accepts a valid order', () => {
    expect(validateOrderInput(okCustomer, okItems).ok).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(validateOrderInput(undefined, okItems).ok).toBe(false);
    expect(validateOrderInput(okCustomer, []).ok).toBe(false);
    expect(validateOrderInput({ ...okCustomer, name: 'A' }, okItems).ok).toBe(false);
  });

  it('rejects an invalid phone number', () => {
    expect(validateOrderInput({ ...okCustomer, phone: '12345' }, okItems).ok).toBe(false);
  });

  it('rejects bad quantities (0, negative, fractional, too large)', () => {
    for (const q of [0, -3, 1.5, MAX_QUANTITY_PER_ITEM + 1]) {
      const items: ClientCartItem[] = [{ ...okItems[0], quantity: q }];
      expect(validateOrderInput(okCustomer, items).ok, `q=${q}`).toBe(false);
    }
  });
});
