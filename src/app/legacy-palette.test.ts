import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8').split('\n');

/** Bóng của nút thương hiệu bên thứ ba (Zalo/Messenger/phone) — giữ nguyên.
 *  (CSS các landing cũ từng được miễn trừ đã gỡ hết ở giai đoạn 4-5 nên không còn vùng miễn trừ nào.) */
const THIRD_PARTY = /floating-(zalo|phone|messenger|contact)/;

function offendingLines(pattern: RegExp): string[] {
  const out: string[] = [];
  let inThirdParty = false;
  CSS.forEach((line, i) => {
    if (/^\.web-app \./.test(line) || /^\.[a-z]/.test(line)) inThirdParty = THIRD_PARTY.test(line);
    if (inThirdParty) return;
    if (pattern.test(line)) out.push(`${i + 1}: ${line.trim()}`);
  });
  return out;
}

describe('hệ dùng chung không còn literal palette cũ', () => {
  it('không còn vàng/nâu cũ', () => {
    expect(offendingLines(/#5c4a00|#B8860B|#DAA520|rgba\(115,\s*92,\s*0|rgba\(218,\s*165,\s*32|rgba\(184,\s*134,\s*11/i)).toEqual([]);
  });

  it('không còn trắng-kem cũ', () => {
    expect(offendingLines(/rgba\(254,\s*252,\s*248|rgba\(253,\s*252,\s*240|#FEFCF8|rgba\(232,\s*227,\s*218/i)).toEqual([]);
  });

  it('không còn navy/wine cũ', () => {
    expect(offendingLines(/rgba\(10,\s*22,\s*40|rgba\(13,\s*27,\s*42|rgba\(114,\s*47,\s*55|#0D1B2A|#722F37/i)).toEqual([]);
  });

  it('không còn class nói dối tên màu', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');
    expect(src).not.toContain('icon-circle-gold');
    expect(src).not.toContain('icon-circle-navy');
  });
});
