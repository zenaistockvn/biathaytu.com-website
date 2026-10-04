import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/*
 * Sau dấu hai chấm luôn viết hoa chữ đầu (DESIGN.md): "Bitburger Premium Pils: Hơn 200 năm", "Màu: Đen sâu".
 * Chỉ xét chữ trong chuỗi JSON, chuỗi '...' "..." `...` và chữ giữa thẻ JSX; bỏ qua comment, giờ "8:00", URL,
 * thuộc tính trong thẻ HTML, media query, từ có chữ hoa bên trong (iTQi) và tên miền.
 * llms.txt và google-merchant viết tiếng Anh nên bỏ qua.
 */
const ROOT = process.cwd();

function walk(dir: string, match: RegExp): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, match));
    else if (match.test(e.name) && !/\.test\.|\.d\.ts$/.test(e.name)) out.push(p);
  }
  return out;
}

const WS = String.raw`(?:\s|\\[nrt]|&nbsp;| )`;
const AFTER_COLON = new RegExp(
  String.raw`(?<=[^\s:]):((?:${WS}|<[^<>]*>|\\?["']|\[|\*{1,2}|_)+)(\p{Ll})(\p{L}*)(?!\p{L}|[.]\p{L})`,
  'gu',
);
const LITERAL_TS = /\/\*[\s\S]*?\*\/|(?<![:'"`\\])\/\/[^\n]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`|(?<![=-])>(?!=)[^<>{}]*</g;
const LITERAL_JSON = /"(?:[^"\\]|\\.)*"/g;

function violations(file: string): string[] {
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const out: string[] = [];
  for (const lit of text.matchAll(file.endsWith('.json') ? LITERAL_JSON : LITERAL_TS)) {
    if (lit[0].startsWith('/*') || lit[0].startsWith('//')) continue;
    for (const m of lit[0].matchAll(AFTER_COLON)) {
      const before = lit[0].slice(0, m.index);
      if (!new RegExp(WS).test(m[1]) || /\p{Lu}/u.test(m[3])) continue;
      if (before.lastIndexOf('<') > before.lastIndexOf('>')) continue;
      if (/\((?:prefers|max|min|orientation|pointer|hover|any-pointer|any-hover)[\w-]*$/.test(before)) continue;
      out.push(`${file}: "${before.slice(-30)}:${m[1]}${m[2]}${m[3]}"`);
    }
  }
  return out;
}

describe('viết hoa sau dấu hai chấm', () => {
  it('mọi chữ hiển thị viết hoa chữ đầu sau ":"', () => {
    const files = [
      ...walk('src/data', /\.json$/),
      ...walk('src', /\.tsx?$/).filter((f) => !/llms\.txt|google-merchant/.test(f)),
    ];
    expect(files.flatMap(violations)).toEqual([]);
  });
});
