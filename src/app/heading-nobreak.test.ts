import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { noBreak, noBreakHeadingsHtml } from '@/lib/vn-text';

/*
 * Tiêu đề không gãy giữa từ ghép ("Lịch / sử") và không rớt một chữ lẻ xuống dòng (DESIGN.md).
 * Tiêu đề lấy từ biến ({article.title}, {title}...) phải qua noBreak()/noBreakNode() của src/lib/vn-text.ts.
 */
const ROOT = process.cwd();

function walk(dir: string): string[] {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.tsx$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
  });
}

describe('tiêu đề xuống dòng đúng tiếng Việt', () => {
  it('nối từ ghép và hai chữ cuối', () => {
    const out = noBreak('Nguồn gốc Bia Thầy Tu: Lịch sử bị lãng quên của Tu viện Ettal');
    expect(out).toContain('Lịch sử');
    expect(out).toContain('Nguồn gốc');
    expect(out).toContain('lãng quên');
    expect(out).toContain('Tu viện Ettal');
  });

  it('tiêu đề con trong thân bài được nối, thẻ và thuộc tính giữ nguyên', () => {
    const html = '<h2 id="a b">Bí quyết <a href="/x y">bia lúa mì</a> tại nhà</h2><p>lịch sử nhà bia</p>';
    expect(noBreakHeadingsHtml(html)).toBe(
      '<h2 id="a b">Bí quyết <a href="/x y">bia lúa mì</a> tại nhà</h2><p>lịch sử nhà bia</p>',
    );
  });

  it('tiêu đề hiển thị từ biến đều qua noBreak', () => {
    const unwrapped = /<(h[1-4])\b[^>]*>\s*\{(?!noBreak)[\w.?]*(?:title|name|Title)\}\s*<\/\1>/g;
    const hits = walk('src/app/(web)').flatMap((file) =>
      [...fs.readFileSync(path.join(ROOT, file), 'utf8').matchAll(unwrapped)].map((m) => `${file}: ${m[0]}`),
    );
    expect(hits).toEqual([]);
  });
});
