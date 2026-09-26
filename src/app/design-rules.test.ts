import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function walk(dir: string, match: RegExp): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, match));
    else if (match.test(e.name) && !/\.test\./.test(e.name)) out.push(p);
  }
  return out;
}

// Tên riêng được phép viết hoa giữa câu; không tính khi đo tiêu đề Viết Hoa Mỗi Chữ.
const PROPER_NOUNS = new Set(['Bia', 'Thầy', 'Tu', 'Benediktiner', 'Bitburger', 'Reinheitsgebot', 'Đức', 'Weissbier', 'Dunkel', 'Naturtrüb', 'Ettal', 'Bavaria']);

describe('quy tắc DESIGN.md áp cho mọi component', () => {
  it('component đã dọn không còn style inline', () => {
    for (const file of [
      'src/app/(web)/components/AlcoholWarning.tsx',
      'src/app/(web)/components/CompanyLegalDetails.tsx',
      'src/app/(web)/components/ProductDetailsAccordion.tsx',
      'src/app/(web)/components/LanguageSwitcher.tsx',
      'src/app/(web)/components/ProductConsultationForm.tsx',
      'src/app/(bare)/chua-du-tuoi/page.tsx',
      'src/app/(web)/components/GeoLocalCTA.tsx',
    ]) {
      expect(read(file), file).not.toMatch(/style=\{\{|dangerouslySetInnerHTML/);
    }
  });

  it('style inline chỉ còn ở chỗ giá trị động (số cột ProfileScale) và noscript của Pixel', () => {
    const files = walk('src/app/(web)', /\.tsx$/).filter((file) => /style=\{\{/.test(read(file)));
    expect(files.map((f) => path.basename(f)).sort()).toEqual(['FacebookPixel.tsx', 'ProfileScale.tsx']);
  });

  it('không có !important trong CSS (kiểu gốc dùng :where để class component thắng)', () => {
    const offenders = walk('src', /\.css$/).filter((file) => read(file).replace(/\/\*[\s\S]*?\*\//g, '').includes('!important'));
    expect(offenders).toEqual([]);
    expect(fs.existsSync(path.join(ROOT, 'src/app/mobile-overrides.css'))).toBe(false);
  });

  it('tiêu đề trong bài viết viết hoa đầu câu, không Viết Hoa Mỗi Chữ (L12)', () => {
    const articles = JSON.parse(read('src/data/articles.json')) as Array<{ slug: string; content?: string }>;
    const offenders = articles.flatMap((a) =>
      [...(a.content ?? '').matchAll(/^#{2,4} (.+)$|<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gm)]
        .map((m) => (m[1] ?? m[2]).replace(/<[^>]+>/g, ''))
        .filter((text) => {
          const words = text.split(/\s+/).map((w) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')).filter((w) => /^\p{L}/u.test(w) && !PROPER_NOUNS.has(w));
          return words.length >= 4 && words.filter((w) => /^\p{Lu}/u.test(w)).length / words.length > 0.8;
        })
        .map((text) => `${a.slug}: ${text}`),
    );
    expect(offenders).toEqual([]);
  });

  it('không có chữ nhỏ hơn 12px trong CSS', () => {
    const offenders = walk('src/app', /\.css$/).flatMap((file) =>
      [...read(file).matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
        .filter((m) => Number(m[1]) < 12)
        .map((m) => `${file}: ${m[0]}`),
    );
    expect(offenders).toEqual([]);
  });

  it('không nhấc phần tử khi rê chuột (translateY trong :hover)', () => {
    const offenders = walk('src/app', /\.css$/).flatMap((file) =>
      (read(file).match(/[^{}]*:hover[^{}]*\{[^}]*translateY\([^)]*\)[^}]*\}/g) || []).map((rule) => `${file}: ${rule.trim().split('{')[0]}`),
    );
    expect(offenders).toEqual([]);
  });

  it('bảng liên hệ: nhãn Barlow Condensed in hoa, focus 2px xanh trời, icon không khung tròn (B2, B4, B5)', () => {
    const css = read('src/app/(web)/components/FloatingZaloCTA.module.css');
    expect(css).toMatch(/\.root \.trigger \{[^}]*font-family:\s*var\(--font-condensed\)[^}]*text-transform:\s*uppercase/);
    expect(css).toMatch(/\.root \.trigger:focus-visible \{[^}]*outline:\s*2px solid var\(--web-accent\)/);
    expect(css).not.toMatch(/\.mark \{[^}]*border-radius:\s*50%/);
    expect(read('src/app/(web)/components/FloatingZaloCTA.tsx')).not.toMatch(/aria-hidden="true">[ZM]</);
  });

  it('tab danh mục /san-pham theo kiểu nhãn điều hướng (B2)', () => {
    expect(read('src/app/(web)/components/CatalogStickyNav.module.css')).toMatch(/\.link \{[^}]*font-family:\s*var\(--font-condensed\)[^}]*text-transform:\s*uppercase/);
  });

  it('DESIGN.md mô tả đúng token và nguồn dữ liệu hiện tại', () => {
    const doc = read('DESIGN.md');
    for (const text of ['--web-section-py', '--web-fs-hero-page', '--web-catalog-nav-h', '88px', 'SkuActionBar', 'ProductCatalog', 'src/config/navigation.ts', 'supportHours']) {
      expect(doc, text).toContain(text);
    }
    expect(doc).not.toContain('ô viền "Showroom", "Liên hệ tư vấn"');
  });
});
