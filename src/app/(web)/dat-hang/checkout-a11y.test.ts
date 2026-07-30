import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/dat-hang/page.tsx'), 'utf8');

describe('a11y form checkout', () => {
  const FIELDS: Array<{ name: string; id: string; autoComplete: string }> = [
    { name: 'name', id: 'co-name', autoComplete: 'name' },
    { name: 'phone', id: 'co-phone', autoComplete: 'tel' },
    { name: 'email', id: 'co-email', autoComplete: 'email' },
    { name: 'receiverName', id: 'co-recv-name', autoComplete: 'name' },
    { name: 'receiverPhone', id: 'co-recv-phone', autoComplete: 'tel' },
    { name: 'address', id: 'co-address', autoComplete: 'street-address' },
    { name: 'note', id: 'co-note', autoComplete: 'off' },
  ];

  it.each(FIELDS)('field $name có id, label htmlFor và autoComplete', ({ name, id, autoComplete }) => {
    expect(SRC).toContain(`id="${id}"`);
    expect(SRC).toContain(`htmlFor="${id}"`);
    expect(SRC).toContain(`name="${name}"`);
    expect(SRC).toMatch(new RegExp(`autoComplete="${autoComplete}"`));
  });

  it('hai field số điện thoại có inputMode numeric', () => {
    expect((SRC.match(/inputMode="numeric"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it('không còn label trần (không htmlFor) trong form checkout', () => {
    const bare = [...SRC.matchAll(/<label className="checkout-label"(?![^>]*htmlFor)/g)];
    expect(bare).toEqual([]);
  });
});

describe('kích thước vùng chạm ≥ 44px', () => {
  const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');
  function block(selector: string): string {
    const i = CSS.indexOf(selector);
    expect(i, `không tìm thấy selector ${selector}`).toBeGreaterThan(-1);
    return CSS.slice(i, CSS.indexOf('}', i));
  }
  it.each([
    '.web-app .checkout-qty-btn {',
    '.web-app .cart-icon-wrap {',
  ])('%s có min-width/min-height ≥ 44px', (sel) => {
    const b = block(sel);
    const nums = [...b.matchAll(/min-(?:width|height):\s*(\d+)px/g)].map((m) => Number(m[1]));
    expect(nums.length).toBeGreaterThanOrEqual(2);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(44);
  });
});
