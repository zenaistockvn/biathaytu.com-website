/**
 * Tên gọi chuẩn cho các route điều hướng. Header, menu mobile, thanh điều hướng dưới, footer,
 * breadcrumb hiển thị và JSON-LD breadcrumb cùng đọc từ đây: một đích, một tên.
 * Đổi nhãn ở đây, không viết lại chuỗi trong component.
 */
export interface NavItem {
  href: string;
  label: string;
}

export const NAV = {
  home: { href: '/', label: 'Trang chủ' },
  products: { href: '/san-pham', label: 'Sản phẩm' },
  story: { href: '/thuong-hieu', label: 'Câu chuyện Ettal' },
  enjoy: { href: '/huong-dan-rot-bia-lua-mi', label: 'Thưởng thức' },
  knowledge: { href: '/kien-thuc', label: 'Kiến thức' },
  horeca: { href: '/bia-duc-cho-nha-hang-khach-san', label: 'HORECA và đại lý' },
  // "Liên hệ" dành cho nút mở bảng kênh (Zalo, gọi, Messenger); trang /lien-he là showroom.
  contact: { href: '/lien-he', label: 'Showroom' },
  priceList: { href: '/bang-gia-si-dai-ly', label: 'Bảng giá sỉ' },
  gifts: { href: '/qua-tang-bia-duc', label: 'Quà tặng' },
  buyingInfo: { href: '/thong-tin-mua-hang', label: 'Thông tin mua hàng' },
  certificate: { href: '/chung-nhan-nhap-khau-chinh-hang', label: 'Chứng nhận nhập khẩu' },
  whatIs: { href: '/bia-thay-tu-la-gi', label: 'Bia Thầy Tu là gì' },
  authentic: { href: '/bia-benediktiner-chinh-hang', label: 'Benediktiner chính hãng' },
} as const satisfies Record<string, NavItem>;

export interface ProductLine extends NavItem {
  /** Tên ngắn cho chip menu mobile. */
  short: string;
  group: 'benediktiner' | 'selected';
}

/**
 * Các dòng bia, theo thứ tự hiển thị trong panel "Sản phẩm", menu mobile và footer.
 * Festbier chưa có trang dòng bia: tạm trỏ SKU két 24 lon (quyết định 26/09/2026, xem audit A2).
 */
export const PRODUCT_LINES: readonly ProductLine[] = [
  { href: '/benediktiner-weissbier-naturtrub', label: 'Weissbier Naturtrüb', short: 'Naturtrüb', group: 'benediktiner' },
  { href: '/benediktiner-dunkel', label: 'Weissbier Dunkel', short: 'Dunkel', group: 'benediktiner' },
  { href: '/san-pham/benediktiner-festbier-ket-24-lon-500ml', label: 'Festbier', short: 'Festbier', group: 'benediktiner' },
  { href: '/bitburger-premium-pils', label: 'Bitburger Premium Pils', short: 'Bitburger', group: 'selected' },
];

/** Trang giới thiệu bom 5L; chưa gắn vào dòng bia nào (audit A2, đợt 3). */
export const KEG_PAGE: NavItem = { href: '/bom-bia-5l-benediktiner', label: 'Bom bia 5L' };

/** "Sản phẩm" sáng cho danh mục, mọi trang SKU và các trang dòng bia. */
export function isProductsPath(pathname: string): boolean {
  return (
    pathname === NAV.products.href ||
    pathname.startsWith(`${NAV.products.href}/`) ||
    PRODUCT_LINES.some((line) => line.href === pathname) ||
    pathname === KEG_PAGE.href
  );
}

/**
 * Chuỗi breadcrumb bắt đầu từ trang chủ. Truyền các mục trong NAV cho cấp cha; trang lá không
 * có trong NAV (bài viết, trang sản phẩm) truyền `{ href, label }` với tên riêng của trang.
 */
export function breadcrumbTrail(...items: NavItem[]): NavItem[] {
  return [NAV.home, ...items];
}
