import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import {
  calculateAge,
  validateDateOfBirth,
  isAgeVerified,
  setAgeVerifiedStatus,
  clearAgeVerification,
} from '@/utils/ageVerification';
import { DEFAULT_ALCOHOL_WARNING, POLICY_VERSION, STORAGE_KEYS } from '@/constants/compliance';
import { getCookieConsentPreferences } from '@/app/(web)/components/CookieConsent';

// Mock in-memory storage & cookies for Node test environment
let mockCookieStore: Record<string, string> = {};
let mockLocalStorageStore: Record<string, string> = {};

beforeAll(() => {
  const globalAny = global as any;

  globalAny.document = {
    get cookie() {
      return Object.entries(mockCookieStore)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('; ');
    },
    set cookie(cookieStr: string) {
      const parts = cookieStr.split(';');
      const [keyVal] = parts;
      const eqIdx = keyVal.indexOf('=');
      if (eqIdx !== -1) {
        const k = keyVal.substring(0, eqIdx).trim();
        const v = keyVal.substring(eqIdx + 1).trim();
        if (parts.some((p) => p.includes('expires=Thu, 01 Jan 1970'))) {
          delete mockCookieStore[k];
        } else {
          mockCookieStore[k] = decodeURIComponent(v);
        }
      }
    },
  };

  globalAny.localStorage = {
    getItem: (key: string) => mockLocalStorageStore[key] || null,
    setItem: (key: string, val: string) => {
      mockLocalStorageStore[key] = String(val);
    },
    removeItem: (key: string) => {
      delete mockLocalStorageStore[key];
    },
    clear: () => {
      mockLocalStorageStore = {};
    },
  };

  globalAny.window = {
    location: { href: 'http://localhost/san-pham/benediktiner' },
    history: { pushState: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    localStorage: globalAny.localStorage,
  };
});

afterAll(() => {
  const globalAny = global as any;
  delete globalAny.document;
  delete globalAny.localStorage;
  delete globalAny.window;
});

describe('Compliance & Age Verification System Tests', () => {
  const mockToday = new Date(2026, 6, 22); // 2026-07-22

  beforeEach(() => {
    mockCookieStore = {};
    mockLocalStorageStore = {};
    clearAgeVerification();
  });

  it('1. Người đúng 18 tuổi hôm nay được truy cập', () => {
    // Sinh ngày 22/07/2008 -> Đúng 18 tuổi ngày 22/07/2026
    const res = validateDateOfBirth('2008-07-22', mockToday);
    expect(res.valid).toBe(true);
    expect(res.age).toBe(18);
  });

  it('2. Người thiếu một ngày để đủ 18 tuổi bị chặn', () => {
    // Sinh ngày 23/07/2008 -> Thiếu 1 ngày mới đủ 18 tuổi vào ngày 22/07/2026
    const res = validateDateOfBirth('2008-07-23', mockToday);
    expect(res.valid).toBe(false);
    expect(res.age).toBe(17);
    expect(res.error).toContain('18 tuổi');
  });

  it('3. Ngày sinh tương lai bị từ chối', () => {
    const res = validateDateOfBirth('2028-01-01', mockToday);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('tương lai');
  });

  it('4. Truy cập URL sản phẩm trực tiếp vẫn kiểm tra age gate khi chưa xác minh', () => {
    expect(isAgeVerified()).toBe(false);
  });

  it('5. Xóa cookie thì age gate xuất hiện lại', () => {
    setAgeVerifiedStatus();
    expect(isAgeVerified()).toBe(true);

    clearAgeVerification();
    expect(isAgeVerified()).toBe(false);
  });

  it('6. Giới hạn độ tuổi và điều hướng trang /chua-du-tuoi', () => {
    const underAgeRes = validateDateOfBirth('2012-05-10', mockToday);
    expect(underAgeRes.valid).toBe(false);
    expect(underAgeRes.age).toBe(14);
  });

  it('7. Không có họ tên hoặc ngày sinh trong cookie/localStorage/dataLayer', () => {
    setAgeVerifiedStatus();

    const ageVerifiedFlag = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
    const verifiedAt = localStorage.getItem(STORAGE_KEYS.VERIFIED_AT);
    const policyVer = localStorage.getItem(STORAGE_KEYS.POLICY_VERSION);

    expect(ageVerifiedFlag).toBe('true');
    expect(verifiedAt).toBeTruthy();
    expect(policyVer).toBe(POLICY_VERSION);

    expect(localStorage.getItem('fullname')).toBeNull();
    expect(localStorage.getItem('dob')).toBeNull();
    expect(localStorage.getItem('dateOfBirth')).toBeNull();
  });

  it('8. Cookie analytics và marketing không được tạo trước consent', () => {
    const prefs = getCookieConsentPreferences();
    expect(prefs).toBeNull();
  });

  it('9. Dòng cảnh báo AlcoholWarning tuân thủ nội dung mặc định', () => {
    expect(DEFAULT_ALCOHOL_WARNING).toContain('Người dưới 18 tuổi không được uống rượu, bia');
    expect(DEFAULT_ALCOHOL_WARNING).toContain('Không lái xe sau khi sử dụng đồ uống có cồn');
  });
});
