import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { NAV, breadcrumbTrail } from './navigation';
import { getBreadcrumbSchema } from '@/app/(web)/components/JsonLd';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/** Mọi page.tsx trong src/app/(web). */
function pageFiles(): string[] {
  const out: string[] = [];
  (function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'page.tsx') out.push(p);
    }
  })(path.join(ROOT, 'src/app/(web)'));
  return out;
}

describe('bảng điều hướng chuẩn (audit A3)', () => {
  it('nhãn đã duyệt cho /san-pham, /thuong-hieu, /lien-he', () => {
    expect(NAV.products).toEqual({ href: '/san-pham', label: 'Sản phẩm' });
    expect(NAV.story).toEqual({ href: '/thuong-hieu', label: 'Câu chuyện Ettal' });
    expect(NAV.contact).toEqual({ href: '/lien-he', label: 'Showroom' });
  });

  it('mỗi href chỉ có một mục', () => {
    const hrefs = Object.values(NAV).map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('header, bottom nav, footer không viết cứng link tới route đã có trong NAV', () => {
    const files = [
      'src/app/(web)/components/WebHeader.tsx',
      'src/app/(web)/components/MobileBottomNav.tsx',
      'src/app/(web)/components/WebFooter.tsx',
    ];
    for (const file of files) {
      const src = read(file);
      // Bỏ qua "/": logo dẫn về trang chủ là ảnh, không mang nhãn điều hướng.
      for (const { href } of Object.values(NAV).filter((i) => i.href !== '/')) {
        const hardcoded = new RegExp(`href(?:=|:\\s*)['"]${href.replace(/\//g, '\\/')}['"]`);
        expect(src, `${file} viết cứng ${href}`).not.toMatch(hardcoded);
      }
    }
  });

  it('không còn nhãn cũ cho các route đã chuẩn hoá', () => {
    const header = read('src/app/(web)/components/WebHeader.tsx');
    const bottomNav = read('src/app/(web)/components/MobileBottomNav.tsx');
    expect(header).not.toContain("'Từ 1330'");
    expect(bottomNav).not.toContain("'Bia Đức'");
  });

  it('JSON-LD breadcrumb của mọi trang đi qua breadcrumbTrail()', () => {
    const offenders = pageFiles()
      .filter((f) => fs.readFileSync(f, 'utf8').includes('getBreadcrumbSchema('))
      .filter((f) => !/getBreadcrumbSchema\(breadcrumbTrail\(/.test(fs.readFileSync(f, 'utf8')))
      .map((f) => path.relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it('getBreadcrumbSchema dùng đúng nhãn và URL tuyệt đối', () => {
    const schema = getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/san-pham/x', label: 'X' }));
    const items = schema.itemListElement;
    expect(items.map((i) => i.name)).toEqual(['Trang chủ', 'Sản phẩm', 'X']);
    expect(items[0].item).toMatch(/^https:\/\/[^/]+$/);
    expect(items[1].item).toMatch(/^https:\/\/[^/]+\/san-pham$/);
    expect(items[2].item).toMatch(/\/san-pham\/x$/);
  });
});
