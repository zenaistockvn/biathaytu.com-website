import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');

function tokens(): Record<string, string> {
  const start = CSS.indexOf('.web-app {');
  const block = CSS.slice(start, CSS.indexOf('}', start));
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/(--web-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) out[m[1]] = m[2];
  return out;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function ratio(fg: string, bg: string): number {
  const [a, b] = [luminance(fg), luminance(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('tương phản WCAG AA của các cặp màu token', () => {
  const T = tokens();
  const CASES: Array<{ name: string; fg: string; bg: string; min: number }> = [
    { name: 'link footer trên dải tối', fg: '--web-accent-on-ink', bg: '--web-ink', min: 4.5 },
    { name: 'chữ thường trên dải tối', fg: '--web-on-ink-muted', bg: '--web-ink', min: 4.5 },
    { name: 'chữ chính trên dải tối', fg: '--web-on-ink', bg: '--web-ink', min: 4.5 },
    { name: 'body copy trên section-alt', fg: '--web-text-secondary', bg: '--web-bg-section', min: 4.5 },
    { name: 'body copy trên bg-warm', fg: '--web-text-secondary', bg: '--web-bg-warm', min: 4.5 },
    { name: 'chữ phụ (muted) trên section-alt', fg: '--web-text-muted', bg: '--web-bg-section', min: 4.5 },
    { name: 'chữ phụ (muted) trên bg-warm', fg: '--web-text-muted', bg: '--web-bg-warm', min: 4.5 },
    { name: 'chữ xanh đêm trên thanh vàng nhãn (footer, khối gold)', fg: '--web-ink', bg: '--web-accent-on-ink', min: 4.5 },
    { name: 'chữ chính trên nền trang', fg: '--web-text', bg: '--web-bg', min: 4.5 },
    { name: 'accent trên nền trang', fg: '--web-accent-strong', bg: '--web-bg', min: 4.5 },
  ];

  it.each(CASES)('$name ≥ $min:1', ({ fg, bg, min }) => {
    expect(T[fg], `thiếu token ${fg}`).toBeTruthy();
    expect(T[bg], `thiếu token ${bg}`).toBeTruthy();
    expect(+ratio(T[fg], T[bg]).toFixed(2)).toBeGreaterThanOrEqual(min);
  });

  it('badge 18+ ở footer có font ≥ 12px', () => {
    // Nhãn 18+ của footer nằm trong AlcoholWarning (variant footer), đặt bằng style inline.
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/AlcoholWarning.tsx'), 'utf8');
    const badge = /fontSize:\s*'(\d+)px'[^}]*\}\}>\s*18\+/.exec(src);
    expect(badge, 'không tìm thấy nhãn 18+ trong AlcoholWarning').not.toBeNull();
    expect(Number(badge![1])).toBeGreaterThanOrEqual(12);
  });

  it('mọi token kênh màu -rgb khớp chính xác với token hex cùng tên', () => {
    const start = CSS.indexOf('.web-app {');
    const block = CSS.slice(start, CSS.indexOf('}', start));
    const rgbTokens: Record<string, string> = {};
    for (const m of block.matchAll(/(--web-[a-z0-9-]+-rgb)\s*:\s*([^;]+);/g)) {
      rgbTokens[m[1]] = m[2].trim();
    }
    expect(Object.keys(rgbTokens).length).toBeGreaterThan(0);
    for (const [rgbName, rgbVal] of Object.entries(rgbTokens)) {
      const baseName = rgbName.replace(/-rgb$/, '');
      const hexVal = T[baseName];
      expect(hexVal, `Không tìm thấy token hex tương ứng cho ${rgbName}`).toBeTruthy();
      const [r, g, b] = hexToRgb(hexVal);
      expect(rgbVal).toBe(`${r} ${g} ${b}`);
    }
  });
});
