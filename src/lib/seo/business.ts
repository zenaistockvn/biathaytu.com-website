/** Nguồn sự thật duy nhất cho NAP (Name-Address-Phone) của Bia Thầy Tu. */
export const BUSINESS = {
  name: 'Bia Thầy Tu',
  legalName: 'Bia Thầy Tu (Benediktiner Vietnam)',
  streetAddress: '659A Lạc Long Quân',
  addressLocality: 'Phường Tây Hồ',
  addressRegion: 'Hà Nội',
  addressCountry: 'VN',
  addressFull: '659A Lạc Long Quân, Phường Tây Hồ, Hà Nội',
  phoneDisplay: '0899.191.313',
  phoneE164: '+84899191313',
  phoneTel: '0899191313',
  email: 'info@biathaytu.com',
  zaloUrl: 'https://zalo.me/0899191313',
  websiteUrl: 'https://www.biathaytu.com',
} as const;

export interface BrandInfo {
  brand: string;
  manufacturer: string | null;
  manufacturerCountry: string;
  isBeer: boolean;        // category bia → áp Reinheitsgebot 1516
  isAwardWinner: boolean; // chỉ Benediktiner Weissbier/Naturtrüb đạt iTQi 3 sao
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
