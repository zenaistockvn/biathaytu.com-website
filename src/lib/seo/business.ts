import { COMPANY_CONFIG, getCompanyZaloUrl, isPendingCompanyValue } from '@/config/company';

function normalizePhoneDigits(value: string): string {
  return isPendingCompanyValue(value) ? '' : value.replace(/\D/g, '');
}

const phoneDigits = normalizePhoneDigits(COMPANY_CONFIG.hotline);
const phoneE164 = phoneDigits.startsWith('0')
  ? `+84${phoneDigits.slice(1)}`
  : phoneDigits
    ? `+${phoneDigits}`
    : '';

/** Nguồn NAP dùng cho SEO, dẫn xuất từ cấu hình pháp nhân tập trung. */
export const BUSINESS = {
  name: 'Bia Thầy Tu',
  legalName: COMPANY_CONFIG.legalName,
  streetAddress: COMPANY_CONFIG.showroomAddress,
  addressLocality: '',
  addressRegion: '',
  addressCountry: 'VN',
  addressFull: COMPANY_CONFIG.showroomAddress,
  registeredAddress: COMPANY_CONFIG.registeredAddress,
  taxCode: COMPANY_CONFIG.taxCode,
  businessRegistrationCertificateNumber: COMPANY_CONFIG.businessRegistrationCertificateNumber,
  legalRepresentative: COMPANY_CONFIG.legalRepresentative,
  phoneDisplay: COMPANY_CONFIG.hotline,
  phoneE164,
  phoneTel: phoneDigits,
  email: COMPANY_CONFIG.email,
  zaloUrl: getCompanyZaloUrl() || '',
  websiteUrl: 'https://www.biathaytu.com.vn',
} as const;

export interface BrandInfo {
  brand: string;
  manufacturer: string | null;
  manufacturerCountry: string;
  /** Bang nơi đặt trụ sở nhà sản xuất (Benediktiner Weißbräu GmbH ở Ettal, Bayern; bia ủ tại Lich, Hessen). */
  manufacturerRegion?: string;
  isBeer: boolean;
  isAwardWinner: boolean;
}

/** Suy ra thương hiệu/nhà sản xuất từ tên sản phẩm — KHÔNG hardcode Benediktiner cho tất cả. */
export function getBrandInfo(name: string, category?: string | null): BrandInfo {
  const n = (name || '').toLowerCase();
  const isWine =
    category === 'vang' ||
    /riesling|spätburgunder|spatburgunder|sauvignon|kabinett|auslese|trocken|rappenhof|thörle|thorle|austernkalk|\bvang\b/.test(n);

  if (n.includes('bitburger')) {
    return { brand: 'Bitburger', manufacturer: 'Bitburger Braugruppe GmbH', manufacturerCountry: 'DE', manufacturerRegion: 'Rheinland-Pfalz', isBeer: true, isAwardWinner: false };
  }
  if (n.includes('köstritzer') || n.includes('kostritzer')) {
    return { brand: 'Köstritzer', manufacturer: 'Köstritzer Schwarzbierbrauerei', manufacturerCountry: 'DE', manufacturerRegion: 'Thüringen', isBeer: true, isAwardWinner: false };
  }
  if (category === 'phu-kien') {
    return { brand: 'Benediktiner', manufacturer: null, manufacturerCountry: 'DE', isBeer: false, isAwardWinner: false };
  }
  if (isWine) {
    let brand = 'Rượu vang Đức';
    if (n.includes('rappenhof')) brand = 'Rappenhof';
    else if (n.includes('thörle') || n.includes('thorle')) brand = 'Thörle';
    else if (n.includes('austernkalk')) brand = 'Austernkalk';
    return { brand, manufacturer: null, manufacturerCountry: 'DE', isBeer: false, isAwardWinner: false };
  }
  // Giải iTQi Superior Taste Award 2022 chỉ trao cho Weissbier Naturtrüb, không cho Dunkel hay Festbier.
  const isAwardWinner =
    (n.includes('naturtrüb') || n.includes('naturtrub') || n.includes('weissbier')) && !/dunkel|festbier|mix/.test(n);
  return { brand: 'Benediktiner', manufacturer: 'Benediktiner Weißbräu GmbH', manufacturerCountry: 'DE', manufacturerRegion: 'Bayern', isBeer: true, isAwardWinner };
}
