/**
 * Quan hệ ba cấp của catalog (audit A2): Sản phẩm → Dòng bia → Quy cách (SKU).
 * Mỗi SKU bia khớp đúng một dòng qua `match` trên tên sản phẩm (xem productLines.test.ts).
 * Quyết định của chủ dự án, 26/09/2026:
 * - Festbier chưa có trang dòng bia: link dòng trỏ SKU két 24 lon.
 * - "Mix 2 vị" là nhóm riêng, không có trang dòng.
 * - Bitburger 0.0 và Premium Pils 500ml xếp vào dòng Bitburger.
 */
export type LineId = 'naturtrub' | 'dunkel' | 'festbier' | 'mix' | 'bitburger';
export type LineGroup = 'benediktiner' | 'selected';
export type PackFormat = 'chai' | 'lon' | 'bom';

export interface BeerLine {
  id: LineId;
  label: string;
  /** Tên ngắn cho chip menu mobile và tab danh mục. */
  short: string;
  group: LineGroup;
  /** Đích khi bấm tên dòng (trang dòng bia, hoặc SKU tạm thay). null: không có đích riêng. */
  href: string | null;
  /** Có trang dòng bia thật hay không; không có thì breadcrumb SKU trỏ về nhóm trong danh mục. */
  hasPage: boolean;
  /** Hiện trong menu (panel Sản phẩm, chip mobile, footer, tab danh mục). */
  inNav: boolean;
  match: RegExp;
}

export const BEER_LINES: readonly BeerLine[] = [
  { id: 'naturtrub', label: 'Weissbier Naturtrüb', short: 'Naturtrüb', group: 'benediktiner', href: '/benediktiner-weissbier-naturtrub', hasPage: true, inNav: true, match: /naturtr[uü]b/i },
  { id: 'dunkel', label: 'Weissbier Dunkel', short: 'Dunkel', group: 'benediktiner', href: '/benediktiner-dunkel', hasPage: true, inNav: true, match: /dunkel/i },
  { id: 'festbier', label: 'Festbier', short: 'Festbier', group: 'benediktiner', href: '/san-pham/benediktiner-festbier-ket-24-lon-500ml', hasPage: false, inNav: true, match: /festbier/i },
  { id: 'mix', label: 'Hộp mix 2 vị', short: 'Mix', group: 'benediktiner', href: null, hasPage: false, inNav: false, match: /\bmix\b/i },
  { id: 'bitburger', label: 'Bitburger Premium Pils', short: 'Bitburger', group: 'selected', href: '/bitburger-premium-pils', hasPage: true, inNav: true, match: /bitburger/i },
];

export const LINE_GROUPS: Record<LineGroup, { id: string; title: string }> = {
  benediktiner: { id: 'benediktiner', title: 'Bộ sưu tập Benediktiner' },
  selected: { id: 'bia-duc-khac', title: 'Bia Đức tuyển chọn' },
};

/** Mọi dòng có tên khớp; một SKU hợp lệ khớp đúng một dòng. */
export function matchLines(productName: string): BeerLine[] {
  return BEER_LINES.filter((line) => line.match.test(productName));
}

export function getLineForName(productName: string): BeerLine | null {
  const lines = matchLines(productName);
  return lines.length === 1 ? lines[0] : null;
}

export function getLine(id: LineId): BeerLine {
  const line = BEER_LINES.find((item) => item.id === id);
  if (!line) throw new Error(`Không có dòng bia ${id}`);
  return line;
}

/** Neo của nhóm dòng bia trên trang /san-pham. */
export function lineAnchor(line: BeerLine): string {
  return `/san-pham#${line.id}`;
}

/** Quy cách đóng gói suy từ tên sản phẩm ("thùng 12 chai", "két 24 lon", "Bom 5L"); null nếu tên không ghi. */
export function packFormatOf(productName: string): PackFormat | null {
  if (/\bbom\b/i.test(productName)) return 'bom';
  if (/\blon\b/i.test(productName)) return 'lon';
  if (/\bchai\b/i.test(productName)) return 'chai';
  return null;
}

export const PACK_FORMAT_LABEL: Record<PackFormat, string> = { chai: 'Chai', lon: 'Lon', bom: 'Bom' };
