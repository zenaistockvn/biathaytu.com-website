import { describe, expect, it } from 'vitest';
import { getActivePromoByCode } from './promo';

describe('data/promo', () => {
  it('finds an active promo case-insensitively', () => {
    const promo = getActivePromoByCode('vip10');
    expect(promo).toBeTruthy();
    expect(promo?.code.toUpperCase()).toBe('VIP10');
    expect(promo?.is_active).toBe(true);
  });

  it('returns null for unknown codes', () => {
    expect(getActivePromoByCode('KHONGCO')).toBeNull();
  });

  it('trims whitespace before matching', () => {
    expect(getActivePromoByCode('  FREESHIP  ')?.code.toUpperCase()).toBe('FREESHIP');
  });
});
