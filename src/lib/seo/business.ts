import { BRAND } from '@/lib/brand';

const phoneE164 = `+84${BRAND.hotlineDigits.slice(1)}`;

/** Nguồn NAP dùng cho SEO, dẫn xuất duy nhất từ BRAND. */
export const BUSINESS = {
  name: BRAND.consumerBrand,
  legalName: BRAND.legalName,
  streetAddress: BRAND.showroomAddress,
  addressLocality: 'Ba Đình',
  addressRegion: 'Hà Nội',
  addressCountry: 'VN',
  addressFull: BRAND.showroomAddress,
  registeredAddress: BRAND.registeredAddress,
  taxCode: BRAND.taxCode,
  businessRegistrationCertificateNumber: BRAND.businessRegistrationCertificateNumber,
  legalRepresentative: BRAND.legalRepresentative,
  phoneDisplay: BRAND.hotline,
  phoneE164,
  phoneTel: BRAND.hotlineDigits,
  email: BRAND.email,
  zaloUrl: BRAND.socialLinks.zalo,
  websiteUrl: BRAND.siteUrl,
  sameAs: [BRAND.socialLinks.fanpage, BRAND.socialLinks.messenger],
  exclusivity: BRAND.exclusivity,
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
