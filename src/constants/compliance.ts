export const DEFAULT_ALCOHOL_WARNING =
  'Người dưới 18 tuổi không được uống rượu, bia. Thưởng thức có trách nhiệm. Không lái xe sau khi sử dụng đồ uống có cồn.';

export const AGE_VERIFICATION_EXPIRY_DAYS = Number(
  process.env.NEXT_PUBLIC_AGE_VERIFICATION_EXPIRY_DAYS || 30,
);

// Bump this value whenever the declaration requirements materially change.
// v2 requires full name + date of birth before access.
export const POLICY_VERSION = '2.0';

export const STORAGE_KEYS = {
  AGE_VERIFIED: 'age_verified',
  // Legacy cookie names retained only so clearAgeVerification() can clean them up.
  VERIFIED_AT: 'verified_at',
  POLICY_VERSION: 'policy_version',
  COOKIE_CONSENT: 'cookie_consent_preferences',
} as const;

/**
 * Thông tin chuyển khoản. Bắt buộc cấu hình qua ENV trước khi deploy.
 * KHÔNG dùng placeholder — nếu thiếu ENV, UI phải ẩn phương thức chuyển khoản.
 */
export const BANK_CONFIG = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? '',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? '',
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? '',
};

/** true khi đủ 3 thông tin để hiển thị phương thức chuyển khoản. */
export const IS_BANK_TRANSFER_ENABLED =
  Boolean(BANK_CONFIG.bankName && BANK_CONFIG.accountNumber && BANK_CONFIG.accountHolder);
