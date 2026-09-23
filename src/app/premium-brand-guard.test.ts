import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { getPublishedArticles, INTERNAL_ONLY_ARTICLE_SLUGS } from '@/lib/data/articles';

const require = createRequire(import.meta.url);
const { cleanText, cleanRichText, EMOJI } = require('../../scripts/lib/editorial-clean.cjs');
const { scan: scanHardcodedColors } = require('../../scripts/audit/color-literals.cjs');

const ROOT = process.cwd();

function luminance(hex: string): number {
  const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function sourceFiles(dir: string, ext: RegExp): string[] {
  const out: string[] = [];
  (function walk(d: string) {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (ext.test(e.name) && !/\.test\./.test(e.name)) out.push(p);
    }
  })(dir);
  return out;
}

/** Bỏ comment để chỉ kiểm tra phần hiển thị. */
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

describe('ảnh: chỉ dùng ảnh chính hãng, không dùng ảnh AI', () => {
  // Ảnh AI vẽ sai nhãn chai (chữ vô nghĩa, sai tên hãng), không hợp với bia cao cấp nhập khẩu.
  const ALLOWED = [
    /^\/images\/products\/official\//,
    /^\/images\/brand\/(benediktiner|bitburger)-official\//,
    /^\/images\/products\/placeholder\.png$/,
  ];

  it('mọi ảnh được tham chiếu đều nằm trong thư mục chính hãng', () => {
    const offenders: string[] = [];
    for (const f of [...sourceFiles('src', /\.(tsx?|css)$/), 'src/data/articles.json', 'src/data/products.json']) {
      for (const m of read(f).matchAll(/\/images\/[A-Za-z0-9_./%-]+\.(?:png|jpe?g|webp|avif)/g)) {
        if (!ALLOWED.some((re) => re.test(m[0]))) offenders.push(`${f}: ${m[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('ảnh mới tạo từ tài liệu chính hãng có ghi nguồn', () => {
    expect(read('public/images/brand/benediktiner-official/SOURCES.md')).toContain('so-close-to-heaven.jpg');
    expect(read('public/images/brand/bitburger-official/SOURCES.md')).toContain('siegelhopfen-field.jpg');
  });
});

describe('ký hiệu: không emoji, mũi tên hay gạch ngang dài trong phần hiển thị', () => {
  const GLYPHS = /[→—]/;

  it('dữ liệu bài viết và sản phẩm đã được làm sạch', () => {
    for (const f of ['src/data/articles.json', 'src/data/products.json']) {
      const s = read(f);
      expect(s.match(new RegExp(EMOJI.source, 'gu')) ?? [], `${f} còn emoji`).toEqual([]);
      expect(s.match(/[→—]/g) ?? [], `${f} còn → hoặc —`).toEqual([]);
    }
  });

  it('giao diện TSX không chứa emoji, → hay —', () => {
    const offenders: string[] = [];
    for (const f of sourceFiles('src/app', /\.tsx$/)) {
      stripComments(read(f)).split('\n').forEach((line, i) => {
        if (new RegExp(EMOJI.source, 'u').test(line) || GLYPHS.test(line)) offenders.push(`${f}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('dump_data.js làm sạch dữ liệu mỗi lần build', () => {
    const dump = read('scripts/dump_data.js');
    expect(dump).toContain("require('./lib/editorial-clean.cjs')");
    expect(dump).toMatch(/inScopeArticles\.map\(cleanArticle\)/);
    expect(dump).toMatch(/cleanProduct\(/);
  });

  it('bộ làm sạch giữ nghĩa của nội dung', () => {
    expect(cleanRichText('<h2>Weissbier — Bản tình ca</h2><p>đục tự nhiên — người Đức gọi</p>'))
      .toBe('<h2>Weissbier: Bản tình ca</h2><p>đục tự nhiên, người Đức gọi</p>');
    expect(cleanRichText('<a href="/san-pham">→ Xem sản phẩm</a>')).toBe('<a href="/san-pham">Xem sản phẩm</a>');
    expect(cleanRichText('<li>miếng ăn → ngụm bia → hậu vị</li>')).toBe('<li>miếng ăn, rồi ngụm bia, rồi hậu vị</li>');
    expect(cleanRichText('<td>⭐⭐⭐⭐</td>')).toBe('<td>4/5</td>');
    expect(cleanRichText('| Pilsner | ❌ |')).toBe('| Pilsner | Không |');
    expect(cleanText('Nhiệt độ 8–10°C, rgba(0,0,0,.5)')).toBe('Nhiệt độ 8–10°C, rgba(0,0,0,.5)');
    expect(cleanRichText('<p style="color: rgba(0,0,0,.5)">A</p>')).toBe('<p style="color: rgba(0,0,0,.5)">A</p>');
  });
});

describe('màu: không lặp lại lỗi của lần đổi palette trước', () => {
  it('không còn màu viết cứng nào ngoài khối token', () => {
    expect(scanHardcodedColors()).toEqual([]);
  });

  it('mọi token kênh màu rgb đều khớp giá trị của token hex tương ứng', () => {
    const css = read('src/app/web.css');
    const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
    const hexMap: Record<string, string> = {};
    for (const m of rootBlock.matchAll(/--web-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) {
      hexMap[m[1]] = m[2].toUpperCase();
    }
    for (const m of rootBlock.matchAll(/--web-([a-z0-9-]+)-rgb:\s*([0-9]+),\s*([0-9]+),\s*([0-9]+);/g)) {
      const name = m[1];
      const [r, g, b] = [Number(m[2]), Number(m[3]), Number(m[4])];
      const hexFromRgb = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
      expect(hexMap[name], `Token hex --web-${name} phải tồn tại trong :root`).toBeDefined();
      expect(hexFromRgb, `Kênh --web-${name}-rgb (${r}, ${g}, ${b}) phải khớp hex ${hexMap[name]}`).toBe(hexMap[name]);
    }
  });

  it('không khối nào đặt chữ ink trên nền accent (thành chữ tối trên nền tối)', () => {
    const offenders: string[] = [];
    const cssFiles = sourceFiles('src', /\.css$/);
    const tsxFiles = sourceFiles('src', /\.tsx$/);

    for (const f of cssFiles) {
      const content = stripComments(read(f));
      for (const block of content.match(/\{[^}]+\}/g) || []) {
        const hasAccentBg = /background(?:-color)?:\s*[^;]*\bvar\(--web-accent(?:-strong|-hover)?\)/.test(block);
        const hasInkText = /\bcolor:\s*[^;]*\bvar\(--web-(?:ink|text)\b[a-z0-9-]*\)/.test(block);
        if (hasAccentBg && hasInkText) offenders.push(`${f}: ${block.replace(/\s+/g, ' ')}`);
      }
    }

    for (const f of tsxFiles) {
      const content = stripComments(read(f));
      for (const styleBlock of content.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []) {
        for (const block of styleBlock.match(/\{[^}]+\}/g) || []) {
          const hasAccentBg = /background(?:-color)?:\s*[^;]*\bvar\(--web-accent(?:-strong|-hover)?\)/.test(block);
          const hasInkText = /\bcolor:\s*[^;]*\bvar\(--web-(?:ink|text)\b[a-z0-9-]*\)/.test(block);
          if (hasAccentBg && hasInkText) offenders.push(`${f} (<style>): ${block.replace(/\s+/g, ' ')}`);
        }
      }
      for (const inlineBlock of content.match(/style=\{\{[\s\S]*?\}\}/g) || []) {
        const hasAccentBg = /\b(?:background|backgroundColor)\s*:\s*['"`]?var\(--web-accent(?:-strong|-hover)?\)/.test(inlineBlock);
        const hasInkText = /\bcolor\s*:\s*['"`]?var\(--web-(?:ink|text)\b[a-z0-9-]*\)/.test(inlineBlock);
        if (hasAccentBg && hasInkText) offenders.push(`${f} (inline): ${inlineBlock.replace(/\s+/g, ' ')}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('--web-accent-soft không dùng làm color: ở bất kỳ đâu', () => {
    const offenders: string[] = [];
    for (const f of [...sourceFiles('src', /\.css$/), ...sourceFiles('src', /\.tsx$/)]) {
      const content = stripComments(read(f));
      content.split('\n').forEach((line, i) => {
        if (/(?<![-a-zA-Z])color\s*:\s*[^;]*\bvar\(--web-accent-soft\)/.test(line)) {
          offenders.push(`${f}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it('không giảm opacity trong quy tắc a:hover', () => {
    const offenders: string[] = [];
    for (const f of sourceFiles('src', /\.css$/)) {
      const content = stripComments(read(f));
      for (const m of content.matchAll(/([^{}]+a:hover[^{}]*)\{([^}]+)\}/g)) {
        const selector = m[1].trim();
        const body = m[2];
        const opacityMatch = body.match(/\bopacity:\s*([0-9.]+)/);
        if (opacityMatch && Number(opacityMatch[1]) < 1) {
          offenders.push(`${f}: ${selector} { ${body.trim()} }`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('Heading/Text đặt tên màu theo vai trò, không theo tên màu', () => {
    for (const f of ['src/app/(web)/components/ui/Heading.tsx', 'src/app/(web)/components/ui/Text.tsx']) {
      expect(read(f)).not.toMatch(/'(gold|navy|white|gold-dark)'/);
    }
    const calls = sourceFiles('src/app', /\.tsx$/).flatMap((f) => [...read(f).matchAll(/<(?:Heading|Text)[^>]*color="([a-z-]+)"/g)].map((m) => m[1]));
    expect(calls.filter((c) => ['gold', 'navy', 'white', 'gold-dark'].includes(c))).toEqual([]);
  });

  it('chữ trên dải trời đạt AA ngay cả ở điểm sáng nhất của gradient', () => {
    const css = read('src/app/web.css');
    const block = css.slice(css.indexOf('.web-app {'), css.indexOf('}', css.indexOf('.web-app {')));
    const token = (name: string) => (block.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`)) ?? [])[1];
    const sky = block.match(/--web-sky:\s*linear-gradient\(([^;]+)\);/)?.[1] ?? '';
    const stops = [...sky.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) => m[0]);
    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const fg of ['--web-on-ink', '--web-on-ink-muted', '--web-accent-on-ink']) {
      for (const bg of stops) expect(+ratio(token(fg), bg).toFixed(2), `${fg} trên ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('hiệu ứng: không dùng hiệu ứng kiểu AI', () => {
  const css = ['src/app/web.css', 'src/app/brand-consistency.css', 'src/app/editorial-pages.css', 'src/app/mobile-overrides.css']
    .map(read).join('\n');

  it('không chữ gradient và không animation lặp vô hạn', () => {
    expect(css).not.toMatch(/background-clip:\s*text/);
    expect(css).not.toMatch(/animation:[^;]*infinite/);
  });

  it('không còn font cũ và không dùng độ đậm 800/900', () => {
    expect(css).not.toMatch(/Playfair|--font-serif/);
    expect(css).not.toMatch(/font-weight:\s*(800|900)/);
  });
});

describe('nội dung nội bộ không hiển thị công khai', () => {
  it('bài marketing nội bộ không có trên website, sitemap hay llms.txt', () => {
    const slugs = new Set(getPublishedArticles().map((a) => a.slug));
    for (const slug of INTERNAL_ONLY_ARTICLE_SLUGS) expect(slugs.has(slug), slug).toBe(false);
  });
});
