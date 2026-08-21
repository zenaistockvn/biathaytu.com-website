export const COMPANY_CONFIG = {
  legalName: '<<CAN_CAP_NHAT: ten_cong_ty>>',
  taxCode: '<<CAN_CAP_NHAT: ma_so_thue>>',
  businessRegistrationCertificateNumber: '<<CAN_CAP_NHAT: so_giay_chung_nhan_dkkd>>',
  registeredAddress: '<<CAN_CAP_NHAT: dia_chi_tru_so_theo_dkkd>>',
  showroomAddress: '<<CAN_CAP_NHAT: dia_chi_showroom>>',
  legalRepresentative: '<<CAN_CAP_NHAT: nguoi_dai_dien_theo_phap_luat>>',
  hotline: '<<CAN_CAP_NHAT: hotline>>',
  email: '<<CAN_CAP_NHAT: email>>',
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
