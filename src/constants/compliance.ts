export const DEFAULT_ALCOHOL_WARNING =
  'Người dưới 18 tuổi không được uống rượu, bia. Thưởng thức có trách nhiệm. Không lái xe sau khi sử dụng đồ uống có cồn.';

export const AGE_VERIFICATION_EXPIRY_DAYS = Number(
  process.env.NEXT_PUBLIC_AGE_VERIFICATION_EXPIRY_DAYS || 30,
);

export const POLICY_VERSION = '1.0';

export const STORAGE_KEYS = {
  AGE_VERIFIED: 'age_verified',
  VERIFIED_AT: 'verified_at',
  POLICY_VERSION: 'policy_version',
  COOKIE_CONSENT: 'cookie_consent_preferences',
} as const;

export const BANK_CONFIG = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || '[CẦN PHÁP CHẾ XÁC NHẬN - Ngân hàng MB Bank / Techcombank]',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '[CẦN PHÁP CHẾ XÁC NHẬN - Số tài khoản]',
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || '[CẦN PHÁP CHẾ XÁC NHẬN - Chủ tài khoản]',
};
