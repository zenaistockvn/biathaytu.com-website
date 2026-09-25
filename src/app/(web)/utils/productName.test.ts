import { describe, expect, it } from 'vitest';
import { formatAbv, packWithoutVolume, splitProductName } from './productName';

describe('splitProductName', () => {
  it('tách quy cách sau dấu hai chấm và viết thường lon/chai', () => {
    expect(splitProductName('Bitburger Premium Pils: Két 24 Lon 330ml')).toEqual({
      title: 'Bitburger Premium Pils',
      pack: 'Két 24 lon 330ml',
    });
  });

  it('tách quy cách sau dấu phẩy (dữ liệu cũ)', () => {
    expect(splitProductName('Benediktiner Naturtrüb, thùng 12 chai 500ml')).toEqual({
      title: 'Benediktiner Naturtrüb',
      pack: 'Thùng 12 chai 500ml',
    });
  });

  it('tách bom không có dấu phân cách', () => {
    expect(splitProductName('Benediktiner Festbier Bom 5L')).toEqual({ title: 'Benediktiner Festbier', pack: 'Bom 5L' });
  });

  it('giữ nguyên tên không có quy cách', () => {
    expect(splitProductName('Bitburger Premium Pils')).toEqual({ title: 'Bitburger Premium Pils', pack: null });
    expect(splitProductName('Combo Match Night: 2 Két Bitburger Football + Tặng Xúc Xích 500g').pack).toBeNull();
    expect(splitProductName('Bộ 6 Cốc Benediktiner Chính Hãng 500ml').pack).toBeNull();
  });
});

describe('packWithoutVolume', () => {
  it('bỏ dung tích ở cuối', () => {
    expect(packWithoutVolume('Két 24 lon 330ml')).toBe('Két 24 lon');
    expect(packWithoutVolume('Bom 5L')).toBe('Bom');
    expect(packWithoutVolume(null)).toBeNull();
  });
});

describe('formatAbv', () => {
  it('dùng dấu phẩy thập phân', () => {
    expect(formatAbv('4.8')).toBe('4,8%');
    expect(formatAbv('0')).toBe('0%');
    expect(formatAbv(null)).toBeNull();
  });
});
