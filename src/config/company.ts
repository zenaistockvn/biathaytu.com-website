export const COMPANY_CONFIG = {
  legalName: 'CÔNG TY TNHH GERMAN TASTE',
  /** Website doanh nghiệp nhập khẩu, phân phối; biathaytu.com.vn là trang thương hiệu của công ty. */
  legalWebsite: 'https://www.germantaste.vn',
  taxCode: '0110870013',
  businessRegistrationCertificateNumber: '0110870013',
  registeredAddress: 'Nhà số 22 Lô C khu tái định cư, Số 218 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Thành phố Hà Nội, Việt Nam',
  /** Địa chỉ showroom theo ghim Google Maps "Bia Thầy Tu Đức - Benediktiner" (chủ dự án xác nhận 27/09/2026). */
  showroomAddress: '22 Lô C, Ngõ 26 P. Vạn Phúc, Ngọc Hà, Hà Nội',
  showroomMapUrl: 'https://maps.app.goo.gl/yFtdrLdX7983FxhX6',
  showroomGeo: { latitude: 21.0334126, longitude: 105.8178728 },
  legalRepresentative: 'PHẠM THANH TUYỀN',
  hotline: '0915 31 21 66',
  email: 'info@biathaytu.com.vn',
  /** Giờ hỗ trợ hotline / Zalo hàng ngày, khớp Google Business Profile (chủ dự án chốt 09/10/2026). Một nguồn cho mọi trang. */
  supportHours: '8:00 - 22:00',
  /** Giờ phục vụ của Nhà hàng Bia Thầy Tu tại 26 Vạn Phúc, trùng giờ hỗ trợ (chủ dự án chốt 09/10/2026). */
  restaurantHours: '8:00 - 22:00',
  /** Thực đơn có giá của Nhà hàng Bia Thầy Tu, cùng link gắn trên Google Business Profile. */
  restaurantMenuUrl: 'https://menu.biathaytu.com.vn/',
} as const;

/** Bản đồ nhúng ghim đúng toạ độ showroom (link rút gọn maps.app.goo.gl không nhúng được). */
export function getShowroomMapEmbedUrl(): string {
  const { latitude, longitude } = COMPANY_CONFIG.showroomGeo;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
}

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
