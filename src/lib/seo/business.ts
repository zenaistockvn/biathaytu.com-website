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
  websiteUrl: 'https://www.biathaytu.com',
} as const;

export interface BrandInfo {
  brand: string;
  manufacturer: string | null;
  manufacturerCountry: string;
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
    return { brand: 'Bitburger', manufacturer: 'Bitburger Braugruppe GmbH', manufacturerCountry: 'DE', isBeer: true, isAwardWinner: false };
  }
  if (n.includes('köstritzer') || n.includes('kostritzer')) {
    return { brand: 'Köstritzer', manufacturer: 'Köstritzer Schwarzbierbrauerei', manufacturerCountry: 'DE', isBeer: true, isAwardWinner: false };
  }
  if (isWine) {
    let brand = 'Rượu vang Đức';
    if (n.includes('rappenhof')) brand = 'Rappenhof';
    else if (n.includes('thörle') || n.includes('thorle')) brand = 'Thörle';
    else if (n.includes('austernkalk')) brand = 'Austernkalk';
    return { brand, manufacturer: null, manufacturerCountry: 'DE', isBeer: false, isAwardWinner: false };
  }
  const isAwardWinner = n.includes('naturtrüb') || n.includes('naturtrub') || n.includes('weissbier');
  return { brand: 'Benediktiner', manufacturer: 'Benediktiner Weißbräu GmbH', manufacturerCountry: 'DE', isBeer: true, isAwardWinner };
}
