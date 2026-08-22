import { describe, expect, it } from 'vitest';
import { formatPrice, formatUnitPrice } from './pricing';

describe('retail pricing helpers', () => {
  it('formats Vietnamese retail prices with dot separators and dong symbol', () => {
    expect(formatPrice(1090000)).toBe('1.090.000₫');
  });

  it('formats case prices to an approximate per-bottle unit price', () => {
    expect(formatUnitPrice({
      price: 1090000,
      name: 'Benediktiner Naturtrüb — Thùng 12 Chai 500ml',
      volume: '500ml',
      category: 'bia',
    })).toBe('≈ 90.800₫/chai');
  });

  it('formats keg prices per liter', () => {
    expect(formatUnitPrice({
      price: 950000,
      name: 'Benediktiner Festbier Bom 5L',
      volume: '5L',
      category: 'bia',
    })).toBe('≈ 190.000₫/lít');
  });

  it('formats a six-glass set per glass', () => {
    expect(formatUnitPrice({
      price: 1500000,
      name: 'Bộ 6 Cốc Benediktiner Chính Hãng 500ml',
      volume: '500ml',
      category: 'phu-kien',
    })).toBe('≈ 250.000₫/cốc');
  });

  it('uses concrete units for single retail bottles and cans', () => {
    expect(formatUnitPrice({
      price: 95000,
      name: 'Benediktiner Naturtrüb Chai 500ml',
      volume: '500ml',
      category: 'bia',
    })).toBe('≈ 95.000₫/chai');

    expect(formatUnitPrice({
      price: 85000,
      name: 'Benediktiner Festbier Lon 500ml',
      volume: '500ml',
      category: 'bia',
    })).toBe('≈ 85.000₫/lon');
  });
});
