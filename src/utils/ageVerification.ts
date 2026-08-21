import { AGE_VERIFICATION_EXPIRY_DAYS, POLICY_VERSION, STORAGE_KEYS } from '@/constants/compliance';

export interface AgeValidationResult {
  valid: boolean;
  age: number;
  error?: string;
}

export interface NameValidationResult {
  valid: boolean;
  normalizedName: string;
  error?: string;
}

/**
 * Tính tuổi chính xác theo Ngày, Tháng, Năm sinh so với ngày hiện tại (hoặc ngày chỉ định).
 */
export function calculateAge(dob: Date, currentDate: Date = new Date()): number {
  let age = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();
  const dayDiff = currentDate.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

/**
 * Họ và tên bắt buộc tối thiểu 2 từ. Chỉ chuẩn hóa trong bộ nhớ trình duyệt;
 * không gửi về server và không lưu trong cookie/database.
 */
export function validateFullName(name: string): NameValidationResult {
  const normalizedName = name.trim().replace(/\s+/g, ' ');
  const words = normalizedName.split(' ').filter(Boolean);

  if (words.length < 2) {
    return {
      valid: false,
      normalizedName,
      error: 'Vui lòng nhập đầy đủ họ và tên (tối thiểu 2 từ).',
    };
  }

  return { valid: true, normalizedName };
}

/**
 * Kiểm tra tính hợp lệ của chuỗi ngày sinh (YYYY-MM-DD) và tính tuổi.
 */
export function validateDateOfBirth(dobString: string, currentDate: Date = new Date()): AgeValidationResult {
  if (!dobString || !dobString.trim()) {
    return { valid: false, age: 0, error: 'Vui lòng nhập ngày sinh.' };
  }

  const [yearStr, monthStr, dayStr] = dobString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { valid: false, age: 0, error: 'Ngày sinh không hợp lệ.' };
  }

  const dob = new Date(year, month - 1, day);

  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return { valid: false, age: 0, error: 'Ngày sinh không tồn tại trên lịch.' };
  }

  if (dob.getTime() > currentDate.getTime()) {
    return { valid: false, age: 0, error: 'Ngày sinh không được ở trong tương lai.' };
  }

  const age = calculateAge(dob, currentDate);
  if (age < 18) {
    return {
      valid: false,
      age,
      error: 'Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.',
    };
  }

  return { valid: true, age };
}

/**
 * Google/Bing crawler được bypass age gate để nội dung SSR vẫn crawl/index bình thường.
 */
export function isSearchCrawlerUserAgent(userAgent: string): boolean {
  return /(googlebot|google-inspectiontool|googleother|google-extended|storebot-google|adsbot-google|mediapartners-google|bingbot|bingpreview)/i.test(
    userAgent || '',
  );
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;

  const maxAge = Math.max(1, Math.floor(days * 24 * 60 * 60));
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};Max-Age=${maxAge};Path=/;SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=;Max-Age=0;Path=/;SameSite=Lax${secure}`;
}

/**
 * Chỉ kiểm tra một cookie trạng thái. Không dùng localStorage và không lưu tên/ngày sinh.
 */
export function isAgeVerified(): boolean {
  return getCookie(STORAGE_KEYS.AGE_VERIFIED) === POLICY_VERSION;
}

/**
 * Lưu duy nhất trạng thái đã xác minh trong cookie 30 ngày.
 * Giá trị cookie là version của chính sách, không chứa họ tên, ngày sinh hay tuổi.
 */
export function setAgeVerifiedStatus(): void {
  setCookie(STORAGE_KEYS.AGE_VERIFIED, POLICY_VERSION, AGE_VERIFICATION_EXPIRY_DAYS);

  // Dọn các cookie legacy của gate cũ; không tạo lại chúng.
  deleteCookie(STORAGE_KEYS.VERIFIED_AT);
  deleteCookie(STORAGE_KEYS.POLICY_VERSION);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ageVerificationPassed'));
  }
}

export function clearAgeVerification(): void {
  deleteCookie(STORAGE_KEYS.AGE_VERIFIED);
  deleteCookie(STORAGE_KEYS.VERIFIED_AT);
  deleteCookie(STORAGE_KEYS.POLICY_VERSION);
}
