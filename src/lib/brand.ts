export const BRAND = {
  name: 'German Taste',
  consumerBrand: 'Benediktiner — Bia Thầy Tu',
  legalName: 'CÔNG TY TNHH GERMAN TASTE',
  taxCode: '0110870013',
  businessRegistrationCertificateNumber: '0110870013',
  registeredAddress:
    'Nhà số 22 Lô C khu tái định cư, Số 218 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Thành phố Hà Nội, Việt Nam',
  showroomAddress: '26 Vạn Phúc, Ba Đình, Hà Nội',
  legalRepresentative: 'PHẠM THANH TUYỀN',
  hotline: '0915 31 21 66',
  hotlineDigits: '0915312166',
  email: 'info@biathaytu.com.vn',
  siteUrl: 'https://biathaytu.com.vn',
  historyFacts:
    'Benediktiner Weissbräu kế thừa truyền thống và công thức từ Tu viện Ettal ở Bavaria; bia hiện được nấu và đóng gói tại Lich, Hessen, Đức.',
  exclusivity:
    'Nhà nhập khẩu và phân phối độc quyền Benediktiner Weissbräu tại Việt Nam',
  legalDisclaimer:
    'Sản phẩm có cồn chỉ dành cho người từ đủ 18 tuổi. Không bán rượu, bia cho người chưa đủ 18 tuổi.',
  socialLinks: {
    zalo: 'https://zalo.me/0915312166',
    fanpage: 'https://www.facebook.com/1106668052525470',
    messenger: 'https://m.me/1106668052525470',
  },
} as const;

export const BRAND_TEL_HREF = `tel:${BRAND.hotlineDigits}` as const;
export const BRAND_MAILTO_HREF = `mailto:${BRAND.email}` as const;
