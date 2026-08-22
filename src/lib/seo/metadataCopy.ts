import { BRAND } from '@/lib/brand';

const SALES_COPY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/giao hàng toàn quốc/gi, 'tư vấn sản phẩm trên toàn quốc'],
  [/giao toàn quốc/gi, 'tư vấn sản phẩm trên toàn quốc'],
  [/miễn phí giao nội thành hà nội/gi, 'thông tin và tư vấn sản phẩm tại Hà Nội'],
  [/giao nhanh/gi, 'thông tin sản phẩm'],
  [/đặt mua/gi, 'tìm hiểu'],
  [/đặt hàng/gi, 'liên hệ tư vấn'],
  [/mua bia đức/gi, 'thông tin bia Đức nhập khẩu'],
  [/mua bia benediktiner/gi, 'thông tin Benediktiner'],
  [/đăng ký ngay!?/gi, 'liên hệ để được tư vấn'],
];

const LEGACY_IDENTITY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Phân phối chính hãng tại Tây Hồ, Hà Nội\.?/gi, ''],
  [/659A\s+Lạc Long Quân,?\s*(?:Xuân La,?\s*)?Tây Hồ,?\s*Hà Nội/gi, BRAND.showroomAddress],
  [/Công ty TNHH Euro Choice Việt Nam/gi, BRAND.legalName],
  [/Euro Choice/gi, BRAND.name],
  [/Cherry Group/gi, BRAND.name],
  [/0899191313/g, BRAND.hotlineDigits],
  [/0899\.191\.313/g, BRAND.hotline],
  [/0899\s*19\s*13\s*13/g, BRAND.hotline],
  [/\+84[\s.-]*915[\s.-]*312[\s.-]*166/g, BRAND.hotline],
  [/info@biathaytu\.com(?!\.vn)/gi, BRAND.email],
  [/659A/gi, '26'],
  [/Lạc Long Quân/gi, 'Vạn Phúc'],
  [/Tây Hồ/gi, 'Ba Đình'],
];

export function normalizeBrandIdentity(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  return LEGACY_IDENTITY_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  )
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Chuẩn hóa copy dữ liệu cũ sang brochure mode và danh tính German Taste hiện hành. */
export function toBrochureMetadataCopy(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  const brochureCopy = SALES_COPY_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  );

  return normalizeBrandIdentity(brochureCopy);
}

export function toMetaDescription(value: string | null | undefined, maxLength = 155): string | undefined {
  const normalized = toBrochureMetadataCopy(value);
  if (!normalized) return undefined;
  if (normalized.length <= maxLength) return normalized;

  const cutoff = normalized.slice(0, maxLength - 1);
  const lastSpace = cutoff.lastIndexOf(' ');
  const trimmed = (lastSpace > 90 ? cutoff.slice(0, lastSpace) : cutoff).replace(/[,:;\-–—\s]+$/, '');
  return `${trimmed}.`;
}
