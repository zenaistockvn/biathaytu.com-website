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
    expect(LAYOUT).toContain('Inter');
    expect(LAYOUT).toContain('Playfair_Display');
    const fm = DESIGN.slice(0, DESIGN.indexOf('---', 4));
    expect(fm).toMatch(/sans:\s*"Inter/);
    expect(fm).toMatch(/serif:\s*"Playfair Display/);
    expect(fm).not.toMatch(/Be Vietnam Pro/);
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
