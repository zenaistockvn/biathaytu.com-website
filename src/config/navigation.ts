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
  horeca: { href: '/bia-duc-cho-nha-hang-khach-san', label: 'HORECA' },
  // "Liên hệ" dành cho nút mở bảng kênh (Zalo, gọi, Messenger); trang /lien-he là showroom.
  contact: { href: '/lien-he', label: 'Showroom' },
} as const satisfies Record<string, NavItem>;

/**
 * Chuỗi breadcrumb bắt đầu từ trang chủ. Truyền các mục trong NAV cho cấp cha; trang lá không
 * có trong NAV (bài viết, trang sản phẩm) truyền `{ href, label }` với tên riêng của trang.
 */
export function breadcrumbTrail(...items: NavItem[]): NavItem[] {
  return [NAV.home, ...items];
}
