import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getBeerProducts } from '@/lib/data/products';
import { BEER_LINES, matchLines, packFormatOf } from './productLines';
import { PRODUCT_LINES } from './navigation';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('quan hệ Sản phẩm → Dòng bia → Quy cách (audit A2)', () => {
  it('mỗi SKU bia đang hiển thị khớp đúng một dòng bia', () => {
    const problems = getBeerProducts()
      .map((product) => ({ slug: product.slug, lines: matchLines(product.name).map((line) => line.id) }))
      .filter((item) => item.lines.length !== 1);
    expect(problems).toEqual([]);
  });

  it('dòng nào cũng có ít nhất một SKU (không có nhóm rỗng)', () => {
    const beers = getBeerProducts();
    for (const line of BEER_LINES) {
      expect(beers.some((product) => line.match.test(product.name)), line.id).toBe(true);
    }
  });

  it('dòng có trang riêng thì trang đó tồn tại; dòng không có trang không trỏ về trang dòng giả', () => {
    for (const line of BEER_LINES.filter((item) => item.hasPage)) {
      expect(fs.existsSync(path.join(ROOT, 'src/app/(web)', line.href as string, 'page.tsx')), line.id).toBe(true);
    }
    for (const line of BEER_LINES.filter((item) => !item.hasPage && item.href)) {
      expect(line.href, line.id).toMatch(/^\/san-pham\//);
    }
  });

  it('menu chỉ lấy dòng có đích, theo đúng thứ tự BEER_LINES', () => {
    expect(PRODUCT_LINES.map((line) => line.id)).toEqual(['naturtrub', 'dunkel', 'festbier', 'bitburger']);
  });

  it('trang dòng bia lấy quy cách qua getLineProducts, không lọc theo chuỗi tên', () => {
    for (const [file, id] of [
      ['src/app/(web)/benediktiner-weissbier-naturtrub/page.tsx', 'naturtrub'],
      ['src/app/(web)/benediktiner-dunkel/page.tsx', 'dunkel'],
      ['src/app/(web)/bitburger-premium-pils/page.tsx', 'bitburger'],
    ]) {
      const src = read(file);
      expect(src, file).toContain(`getLineProducts('${id}')`);
      expect(src, file).not.toMatch(/getBeerProducts\(\)\.filter\(\(p\) => p\.name\.includes/);
    }
  });

  it('trang SKU: breadcrumb Sản phẩm / Dòng bia / Quy cách, JSON-LD cùng chuỗi', () => {
    const src = read('src/app/(web)/san-pham/[slug]/page.tsx');
    expect(src).toContain('const line = isBeer ? getLineForName(product.name) : null;');
    expect(src).toMatch(/getBreadcrumbSchema\(breadcrumbTrail\(\.\.\.\[NAV\.products, lineCrumb, skuCrumb\]/);
    expect(src).toContain('<Link href={lineCrumb.href}>{lineCrumb.label}</Link>');
    expect(src).toContain('{skuCrumb.label}');
  });
});

describe('lọc quy cách (audit A8)', () => {
  it('suy quy cách từ tên: chỉ SKU "bitburger-premium-pils" không ghi quy cách trong tên', () => {
    // products.json không có trường quy cách riêng; SKU này chỉ có dung tích 500ml, không có giá.
    const unknown = getBeerProducts().filter((product) => packFormatOf(product.name) === null).map((product) => product.slug);
    expect(unknown).toEqual(['bitburger-premium-pils']);
  });

  it('packFormatOf nhận đúng chai, lon, bom', () => {
    expect(packFormatOf('Benediktiner Dunkel, thùng 12 chai 500ml')).toBe('chai');
    expect(packFormatOf('Benediktiner Naturtrüb, két 24 lon 500ml')).toBe('lon');
    expect(packFormatOf('Benediktiner Festbier Bom 5L')).toBe('bom');
  });
});
