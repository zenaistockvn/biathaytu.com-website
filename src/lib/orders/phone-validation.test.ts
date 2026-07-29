import { describe, it, expect } from 'vitest';
import { isValidVietnamesePhone } from './validation';

describe('phân tích số điện thoại Việt Nam', () => {
  it('chấp nhận số điện thoại hợp lệ (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)', () => {
    expect(isValidVietnamesePhone('0915312166')).toBe(true);
    expect(isValidVietnamesePhone('0398765432')).toBe(true);
    expect(isValidVietnamesePhone('+84915312166')).toBe(true);
  });

  it('từ chối số điện thoại rác hoặc thiếu số', () => {
    expect(isValidVietnamesePhone('0123456789')).toBe(false); // 01 không còn tồn tại
    expect(isValidVietnamesePhone('0912345')).toBe(false);
    expect(isValidVietnamesePhone('abc1234567')).toBe(false);
    expect(isValidVietnamesePhone('1234567890')).toBe(false);
  });
});
