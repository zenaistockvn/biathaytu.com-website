import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { validateDateOfBirth } from '@/utils/ageVerification';

const SRC = fs.readFileSync(
  path.join(process.cwd(), 'src/app/(web)/components/AgeVerificationGate.tsx'),
  'utf8',
);

describe('AgeVerificationGate — a11y & tối thiểu hoá dữ liệu', () => {
  it('vô hiệu hoá nội dung nền bằng inert khi modal mở', () => {
    expect(SRC).toMatch(/setAttribute\(\s*['"]inert['"]/);
    expect(SRC).toMatch(/removeAttribute\(\s*['"]inert['"]/);
  });

  it('vòng phím Tab trong modal (bẫy focus)', () => {
    expect(SRC).toContain("e.key === 'Tab'");
    expect(SRC).toContain('shiftKey');
  });

  it('KHÔNG còn thu thập họ tên — trường này không mang lại giá trị xác minh', () => {
    expect(SRC).not.toContain('gate-fullname');
    expect(SRC).not.toMatch(/Họ và tên/);
  });

  it('không dùng <h1> để tránh trang có 2 h1', () => {
    expect(SRC).not.toMatch(/<h1[\s>]/);
    expect(SRC).toContain('id="age-gate-title"');
  });
});

describe('validateDateOfBirth — tính chính xác độ tuổi', () => {
  it('validateDateOfBirth: đúng 18 tuổi hôm nay thì hợp lệ, thiếu 1 ngày thì không', () => {
    const today = new Date('2026-07-30T12:00:00Z');
    const exactly18 = '2008-07-30';
    const oneDayShort = '2008-07-31';
    expect(validateDateOfBirth(exactly18, today).valid).toBe(true);
    expect(validateDateOfBirth(oneDayShort, today).valid).toBe(false);
  });
});
