import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const gateSource = fs.readFileSync(
  path.join(process.cwd(), 'src/app/(web)/components/AgeVerificationGate.tsx'),
  'utf8',
);
const utilSource = fs.readFileSync(
  path.join(process.cwd(), 'src/utils/ageVerification.ts'),
  'utf8',
);
const complianceSource = fs.readFileSync(
  path.join(process.cwd(), 'src/constants/compliance.ts'),
  'utf8',
);

describe('Age gate - cơ chế 2 lựa chọn tối giản', () => {
  it('hiển thị đúng câu hỏi và hai lựa chọn', () => {
    expect(gateSource).toContain('Bạn đã đủ 18 tuổi chưa?');
    expect(gateSource).toContain('Tôi đã đủ 18 tuổi');
    expect(gateSource).toContain('Chưa đủ 18 tuổi');
  });

  it('không thu họ tên hoặc ngày sinh và không có màn cảnh báo đỏ riêng', () => {
    expect(gateSource).not.toContain('gate-fullname');
    expect(gateSource).not.toContain('date-of-birth');
    expect(gateSource).not.toMatch(/type=["']date["']/i);
    expect(gateSource).not.toContain('validateFullName');
    expect(gateSource).not.toContain('validateDateOfBirth');
    expect(gateSource).not.toContain('Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.');
  });

  it('người chưa đủ tuổi được chuyển ra ngoài website', () => {
    expect(gateSource).toContain("const UNDERAGE_EXIT_URL = 'https://www.google.com/'");
    expect(gateSource).toContain('window.location.replace(UNDERAGE_EXIT_URL)');
  });

  it('xác nhận đủ tuổi được lưu bằng cookie 30 ngày theo policy version hiện hành', () => {
    expect(complianceSource).toContain('AGE_VERIFICATION_EXPIRY_DAYS = 30');
    expect(complianceSource).toContain("POLICY_VERSION = '3.0'");
    expect(utilSource).toContain('AGE_VERIFICATION_EXPIRY_DAYS');
    expect(utilSource).toContain('Max-Age=');
    expect(utilSource).toContain('setAgeVerifiedStatus');
  });
});
