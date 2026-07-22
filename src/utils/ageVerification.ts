import { AGE_VERIFICATION_EXPIRY_DAYS, POLICY_VERSION, STORAGE_KEYS } from '@/constants/compliance';

export interface AgeValidationResult {
  valid: boolean;
  age: number;
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
 * Kiểm tra tính hợp lệ của chuỗi ngày sinh (YYYY-MM-DD) và tính tuổi.
 */
export function validateDateOfBirth(dobString: string, currentDate: Date = new Date()): AgeValidationResult {
  if (!dobString || !dobString.trim()) {
    return { valid: false, age: 0, error: 'Vui lòng nhập ngày sinh' };
  }

  const [yearStr, monthStr, dayStr] = dobString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { valid: false, age: 0, error: 'Ngày sinh không hợp lệ' };
  }

  const dob = new Date(year, month - 1, day);
  
  // Checking valid date creation
  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return { valid: false, age: 0, error: 'Ngày sinh không tồn tại trên lịch' };
  }

  // Check future date
  if (dob.getTime() > currentDate.getTime()) {
    return { valid: false, age: 0, error: 'Ngày sinh không được ở trong tương lai' };
  }

  const age = calculateAge(dob, currentDate);
  if (age < 18) {
    return { valid: false, age, error: 'Bạn phải từ đủ 18 tuổi trở lên để truy cập website' };
  }

  return { valid: true, age };
}

/**
 * Đọc cookie theo tên
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Ghi cookie
 */
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Xóa cookie
 */
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

/**
 * Kiểm tra trạng thái đã xác minh độ tuổi và chưa hết hạn.
 */
export function isAgeVerified(): boolean {
  if (typeof window === 'undefined') return false;

  const verifiedCookie = getCookie(STORAGE_KEYS.AGE_VERIFIED);
  const verifiedAtCookie = getCookie(STORAGE_KEYS.VERIFIED_AT);
  const policyVersionCookie = getCookie(STORAGE_KEYS.POLICY_VERSION);

  const verifiedLocal = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
  const verifiedAtLocal = localStorage.getItem(STORAGE_KEYS.VERIFIED_AT);
  const policyVersionLocal = localStorage.getItem(STORAGE_KEYS.POLICY_VERSION);

  const verified = verifiedCookie === 'true' || verifiedLocal === 'true';
  const verifiedAtStr = verifiedAtCookie || verifiedAtLocal;
  const policyVersion = policyVersionCookie || policyVersionLocal;

  if (!verified || !verifiedAtStr || policyVersion !== POLICY_VERSION) {
    return false;
  }

  const verifiedAt = new Date(verifiedAtStr);
  if (isNaN(verifiedAt.getTime())) {
    return false;
  }

  const now = new Date();
  const diffDays = (now.getTime() - verifiedAt.getTime()) / (1000 * 3600 * 24);

  if (diffDays > AGE_VERIFICATION_EXPIRY_DAYS) {
    clearAgeVerification();
    return false;
  }

  return true;
}

/**
 * Đặt trạng thái xác minh độ tuổi thành công (Chỉ lưu age_verified, verified_at, policy_version).
 * TUYỆT ĐỐI KHÔNG LƯU HỌ TÊN HAY NGÀY SINH.
 */
export function setAgeVerifiedStatus(): void {
  if (typeof window === 'undefined') return;

  const nowISO = new Date().toISOString();

  setCookie(STORAGE_KEYS.AGE_VERIFIED, 'true', AGE_VERIFICATION_EXPIRY_DAYS);
  setCookie(STORAGE_KEYS.VERIFIED_AT, nowISO, AGE_VERIFICATION_EXPIRY_DAYS);
  setCookie(STORAGE_KEYS.POLICY_VERSION, POLICY_VERSION, AGE_VERIFICATION_EXPIRY_DAYS);

  localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
  localStorage.setItem(STORAGE_KEYS.VERIFIED_AT, nowISO);
  localStorage.setItem(STORAGE_KEYS.POLICY_VERSION, POLICY_VERSION);
}

/**
 * Xóa trạng thái xác minh độ tuổi
 */
export function clearAgeVerification(): void {
  if (typeof window === 'undefined') return;

  deleteCookie(STORAGE_KEYS.AGE_VERIFIED);
  deleteCookie(STORAGE_KEYS.VERIFIED_AT);
  deleteCookie(STORAGE_KEYS.POLICY_VERSION);

  localStorage.removeItem(STORAGE_KEYS.AGE_VERIFIED);
  localStorage.removeItem(STORAGE_KEYS.VERIFIED_AT);
  localStorage.removeItem(STORAGE_KEYS.POLICY_VERSION);
}
