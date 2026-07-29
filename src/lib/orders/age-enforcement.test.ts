import { describe, it, expect } from 'vitest';
import { validateOrderInput } from './validation';
import type { OrderCustomer, ClientCartItem } from './types';

const items: ClientCartItem[] = [{ id: 'p1', name: 'Bia', quantity: 1, image: '', price: 1000 }];
const base = { name: 'Nguyen Van A', phone: '0912345678', address: '1 Test' };

describe('validateOrderInput — bắt buộc xác nhận tuổi', () => {
  it('từ chối khi THIẾU purchaser_age_confirmed', () => {
    const r = validateOrderInput({ ...base, receiver_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/người đặt hàng từ đủ 18/i);
  });

  it('từ chối khi THIẾU receiver_age_confirmed', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/người nhận hàng từ đủ 18/i);
  });

  it('từ chối khi THIẾU terms_agreed', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, receiver_age_confirmed: true } as OrderCustomer, items);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/điều khoản/i);
  });

  it('từ chối khi giá trị không phải boolean true', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: 'yes', receiver_age_confirmed: true, terms_agreed: true } as unknown as OrderCustomer, items);
    expect(r.ok).toBe(false);
  });

  it('chấp nhận khi cả 3 đều === true', () => {
    const r = validateOrderInput({ ...base, purchaser_age_confirmed: true, receiver_age_confirmed: true, terms_agreed: true } as OrderCustomer, items);
    expect(r.ok).toBe(true);
  });
});
