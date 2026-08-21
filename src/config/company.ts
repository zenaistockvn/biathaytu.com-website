export const COMPANY_CONFIG = {
  legalName: 'CÔNG TY TNHH GERMAN TASTE',
  taxCode: '0110870013',
  businessRegistrationCertificateNumber: '0110870013',
  registeredAddress: 'Nhà số 22 Lô C khu tái định cư, Số 218 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Thành phố Hà Nội, Việt Nam',
  showroomAddress: '26 Vạn Phúc, Ba Đình, Hà Nội',
  legalRepresentative: 'PHẠM THANH TUYỀN',
  hotline: '0915 31 21 66',
  email: 'info@biathaytu.com.vn',
} as const;

export function isPendingCompanyValue(value: string): boolean {
  return value.startsWith('<<CAN_CAP_NHAT:');
}

export function getCompanyTelHref(): string | null {
  if (isPendingCompanyValue(COMPANY_CONFIG.hotline)) return null;
  const digits = COMPANY_CONFIG.hotline.replace(/\D/g, '');
  return digits ? `tel:${digits}` : null;
}

export function getCompanyMailtoHref(): string | null {
  if (isPendingCompanyValue(COMPANY_CONFIG.email)) return null;
  return COMPANY_CONFIG.email.includes('@') ? `mailto:${COMPANY_CONFIG.email}` : null;
}

export function getCompanyZaloUrl(): string | null {
  if (isPendingCompanyValue(COMPANY_CONFIG.hotline)) return null;
  const digits = COMPANY_CONFIG.hotline.replace(/\D/g, '');
  return digits ? `https://zalo.me/${digits}` : null;
}
