import { BRAND, BRAND_MAILTO_HREF, BRAND_TEL_HREF } from '@/lib/brand';

/**
 * Compatibility layer for older imports. BRAND is the single source of truth.
 * New UI/components should import from '@/lib/brand' directly.
 */
export const COMPANY_CONFIG = {
  legalName: BRAND.legalName,
  taxCode: BRAND.taxCode,
  businessRegistrationCertificateNumber: BRAND.businessRegistrationCertificateNumber,
  registeredAddress: BRAND.registeredAddress,
  showroomAddress: BRAND.showroomAddress,
  legalRepresentative: BRAND.legalRepresentative,
  hotline: BRAND.hotline,
  email: BRAND.email,
} as const;

export function isPendingCompanyValue(value: string): boolean {
  return value.startsWith('<<CAN_CAP_NHAT:');
}

export function getCompanyTelHref(): string | null {
  return isPendingCompanyValue(BRAND.hotline) ? null : BRAND_TEL_HREF;
}

export function getCompanyMailtoHref(): string | null {
  return isPendingCompanyValue(BRAND.email) ? null : BRAND_MAILTO_HREF;
}

export function getCompanyZaloUrl(): string | null {
  return isPendingCompanyValue(BRAND.hotline) ? null : BRAND.socialLinks.zalo;
}
