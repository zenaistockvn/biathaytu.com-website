import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CSS = fs.readFileSync(path.join(ROOT, 'src/app/web.css'), 'utf8');
const DESIGN = fs.readFileSync(path.join(ROOT, 'DESIGN.md'), 'utf8');
const LAYOUT = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8');

/** Trích khối token trong `.web-app { ... }` đầu tiên. */
function definedTokens(): Map<string, string> {
  const start = CSS.indexOf('.web-app {');
  const end = CSS.indexOf('}', start);
  const block = CSS.slice(start, end);
  const map = new Map<string, string>();
  for (const m of block.matchAll(/(--web-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

/** Mọi token được dùng qua var(--web-…) trong toàn bộ src/. */
function usedTokens(): Set<string> {
  const used = new Set<string>();
  (function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/var\((--web-[a-z0-9-]+)/g)) used.add(m[1]);
      }
    }
  })(path.join(ROOT, 'src'));
  return used;
}

describe('design tokens', () => {
  it('KHÔNG còn token nói dối tên (--web-gold*, --web-navy*)', () => {
    const liars = [...definedTokens().keys(), ...usedTokens()]
      .filter((t) => /^--web-(gold|navy)/.test(t));
    expect([...new Set(liars)]).toEqual([]);
  });

  it('mọi token được dùng đều đã được định nghĩa (bắt lỗi đổi tên sai/gõ sai)', () => {
    const defined = definedTokens();
    const orphans = [...usedTokens()].filter((t) => !defined.has(t));
    expect(orphans).toEqual([]);
  });

  it('DESIGN.md khai đúng font đang nạp trong layout.tsx', () => {
    expect(LAYOUT).toContain("import './fonts.css'");
    expect(LAYOUT).toContain('Barlow_Condensed');
    expect(LAYOUT).toMatch(/\bBarlow\(/);
    const fm = DESIGN.slice(0, DESIGN.indexOf('---', 4));
    expect(fm).toMatch(/display:\s*"Roboto Serif/);
    expect(fm).toMatch(/sans:\s*"Barlow,/);
    expect(fm).toMatch(/condensed:\s*"Barlow Condensed/);
  });

  it('font tiêu đề tự phục vụ khớp đúng độ rộng và độ đậm web dùng', () => {
    const fontsCss = fs.readFileSync(path.join(ROOT, 'src/app/fonts.css'), 'utf8');
    const faces = [...fontsCss.matchAll(/@font-face\s*\{([^}]*)\}/g)]
      .map((m) => m[1])
      .filter((body) => body.includes("font-family: 'Roboto Serif';"));
    expect(faces.length).toBe(2);
    // File chỉ chứa bản rộng 125% và độ đậm 600–700; lệch token là trình duyệt ép giãn/đậm giả.
    const stretch = definedTokens().get('--web-display-stretch');
    for (const body of faces) {
      expect(body).toContain(`font-stretch: ${stretch};`);
      expect(body).toContain('font-weight: 600 700;');
      const file = /url\('([^']+)'\)/.exec(body)?.[1] ?? '';
      expect(fs.existsSync(path.join(ROOT, 'public', file)), file).toBe(true);
      expect(LAYOUT).toContain(`preload('${file}'`);
    }
  });

  it('mọi quy tắc dùng font tiêu đề đều kèm font-stretch (không thì ra bản hẹp)', () => {
    const offenders: string[] = [];
    (function walk(dir: string) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.css$/.test(e.name)) {
          for (const block of fs.readFileSync(p, 'utf8').match(/[^{}]+\{[^{}]*\}/g) || []) {
            if (/font(?:-family)?:\s*var\(--font-display\)/.test(block) && !/font-stretch:/.test(block)) {
              offenders.push(`${path.relative(ROOT, p)}: ${block.trim().split('{')[0].trim()}`);
            }
          }
        }
      }
    })(path.join(ROOT, 'src'));
    expect(offenders).toEqual([]);
  });

  it('bề mặt phẳng: không bóng đổ, góc vuông', () => {
    const defined = definedTokens();
    for (const t of ['--web-shadow', '--web-shadow-md', '--web-shadow-lg', '--web-shadow-xl']) expect(defined.get(t), t).toBe('none');
    for (const t of ['--web-radius', '--web-radius-md', '--web-radius-lg']) expect(defined.get(t), t).toBe('0');
  });

  it('chỉ web.css được khai --web-radius*/--web-shadow* (file nạp sau không được đặt lại)', () => {
    const webLayout = fs.readFileSync(path.join(ROOT, 'src/app/(web)/layout.tsx'), 'utf8');
    const cssFiles = [...webLayout.matchAll(/^import\s+['"]([^'"]+\.css)['"];?/gm)]
      .map((m) => path.resolve(ROOT, 'src/app/(web)', m[1]));
    expect(cssFiles).toContain(path.join(ROOT, 'src/app/web.css'));
    const offenders: string[] = [];
    for (const file of cssFiles) {
      if (file === path.join(ROOT, 'src/app/web.css')) continue;
      for (const m of fs.readFileSync(file, 'utf8').matchAll(/(--web-(?:radius|shadow)[a-z0-9-]*)\s*:/g)) {
        offenders.push(`${path.relative(ROOT, file)}: ${m[1]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('DESIGN.md khai đúng màu chủ đạo của web.css', () => {
    const defined = definedTokens();
    const fm = DESIGN.slice(0, DESIGN.indexOf('---', 4));
    for (const [token, expected] of [
      ['--web-accent', 'primary'],
      ['--web-bg', 'background'],
      ['--web-text', 'text-main'],
      ['--web-border', 'border'],
    ] as const) {
      const value = defined.get(token)!;
      expect(fm.toLowerCase(), `DESIGN.md thiếu ${expected}: ${value}`).toContain(value.toLowerCase());
    }
  });

  it('phần văn bản DESIGN.md không còn mô tả hệ Gold/Navy cũ', () => {
    const body = DESIGN.slice(DESIGN.indexOf('---', 4));
    for (const stale of ['B8860B', '0D1B2A', '722F37', 'FEFCF8', 'Deep Navy', 'Gold gradients']) {
      expect(body, `còn sót "${stale}"`).not.toContain(stale);
    }
  });
});
