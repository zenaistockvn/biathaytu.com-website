import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import {
  calculateAge,
  validateDateOfBirth,
  validateFullName,
  isAgeVerified,
  isSearchCrawlerUserAgent,
  setAgeVerifiedStatus,
  clearAgeVerification,
} from '@/utils/ageVerification';
import { DEFAULT_ALCOHOL_WARNING, POLICY_VERSION, STORAGE_KEYS } from '@/constants/compliance';
import { getCookieConsentPreferences } from '@/app/(web)/components/CookieConsent';

let mockCookieStore: Record<string, string> = {};

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
        const key = keyVal.substring(0, eqIdx).trim();
        const value = keyVal.substring(eqIdx + 1).trim();
        if (parts.some((part) => part.includes('Max-Age=0'))) {
          delete mockCookieStore[key];
        } else {
          mockCookieStore[key] = decodeURIComponent(value);
        }
      }
    },
  };

  globalAny.window = {
    location: { href: 'http://localhost/san-pham/benediktiner', protocol: 'http:' },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
});

afterAll(() => {
  const globalAny = global as any;
  delete globalAny.document;
  delete globalAny.window;
});

describe('Compliance & Age Verification System Tests', () => {
  const mockToday = new Date(2026, 6, 22);

  beforeEach(() => {
    mockCookieStore = {};
    clearAgeVerification();
  });

  it('1. Người đúng 18 tuổi hôm nay được truy cập', () => {
    const res = validateDateOfBirth('2008-07-22', mockToday);
    expect(res.valid).toBe(true);
    expect(res.age).toBe(18);
  });

  it('2. Người thiếu một ngày để đủ 18 tuổi bị chặn', () => {
    const res = validateDateOfBirth('2008-07-23', mockToday);
    expect(res.valid).toBe(false);
    expect(res.age).toBe(17);
    expect(res.error).toBe('Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.');
  });

  it('3. Ngày sinh tương lai bị từ chối', () => {
    const res = validateDateOfBirth('2028-01-01', mockToday);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('tương lai');
  });

  it('4. Họ tên phải có tối thiểu 2 từ', () => {
    expect(validateFullName('Tuấn').valid).toBe(false);
    expect(validateFullName('  Đỗ   Tuấn Anh  ')).toEqual({
      valid: true,
      normalizedName: 'Đỗ Tuấn Anh',
    });
  });

  it('5. Chưa có cookie version hiện tại thì age gate vẫn bắt buộc', () => {
    expect(isAgeVerified()).toBe(false);
    mockCookieStore[STORAGE_KEYS.AGE_VERIFIED] = 'true';
    expect(isAgeVerified()).toBe(false);
  });

  it('6. Trạng thái xác minh chỉ lưu bằng cookie version hiện tại', () => {
    setAgeVerifiedStatus();
    expect(isAgeVerified()).toBe(true);
    expect(mockCookieStore[STORAGE_KEYS.AGE_VERIFIED]).toBe(POLICY_VERSION);
    expect(mockCookieStore[STORAGE_KEYS.VERIFIED_AT]).toBeUndefined();
    expect(mockCookieStore[STORAGE_KEYS.POLICY_VERSION]).toBeUndefined();
  });

  it('7. Xóa cookie thì age gate xuất hiện lại', () => {
    setAgeVerifiedStatus();
    expect(isAgeVerified()).toBe(true);
    clearAgeVerification();
    expect(isAgeVerified()).toBe(false);
  });

  it('8. Google/Bing crawler được nhận diện để bypass gate', () => {
    expect(isSearchCrawlerUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(isSearchCrawlerUserAgent('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
    expect(isSearchCrawlerUserAgent('Mozilla/5.0 Chrome/140 Safari/537.36')).toBe(false);
  });

  it('9. Cookie analytics và marketing không được tạo trước consent', () => {
    const prefs = getCookieConsentPreferences();
    expect(prefs).toBeNull();
  });

  it('10. Dòng cảnh báo AlcoholWarning tuân thủ nội dung mặc định', () => {
    expect(DEFAULT_ALCOHOL_WARNING).toContain('Người dưới 18 tuổi không được uống rượu, bia');
    expect(DEFAULT_ALCOHOL_WARNING).toContain('Không lái xe sau khi sử dụng đồ uống có cồn');
  });
});
