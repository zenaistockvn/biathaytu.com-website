import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import products from '@/data/products.json';

const ROOT = path.resolve(__dirname, '..', '..');
const OG_DIR = path.join(ROOT, 'public', 'images', 'og');

/** Kích thước JPEG đọc từ marker SOF, không cần thư viện ảnh. */
function jpegSize(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(file);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`Không đọc được kích thước ${file}`);
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

describe('ảnh chia sẻ Zalo, Facebook (og:image)', () => {
  it('mọi ảnh trong public/images/og là JPEG 1200x630, dưới 500 KB', () => {
    const files = walk(OG_DIR).filter((file) => !/SOURCES\.md$/.test(file));
    expect(files.length).toBeGreaterThan(4);
    for (const file of files) {
      const rel = path.relative(ROOT, file);
      expect(file, rel).toMatch(/\.jpg$/);
      expect(jpegSize(file), rel).toEqual({ width: 1200, height: 630 });
      expect(fs.statSync(file).size, rel).toBeLessThan(500 * 1024);
    }
  });

  it('mỗi sản phẩm có ảnh gốc đều có thẻ chia sẻ theo slug', () => {
    const missing = (products as Array<{ slug: string; images: string[] | null }>)
      .filter((p) => p.images?.[0] && fs.existsSync(path.join(ROOT, 'public', p.images[0])))
      .filter((p) => !fs.existsSync(path.join(OG_DIR, 'products', `${p.slug}.jpg`)))
      .map((p) => p.slug);
    expect(missing).toEqual([]);
  });

  it('mỗi bài Kiến thức đều có thẻ chia sẻ theo slug', () => {
    const articles = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/articles.json'), 'utf8')) as Array<{ slug: string | null }>;
    const missing = articles
      .filter((a) => a.slug && !fs.existsSync(path.join(OG_DIR, 'articles', `${a.slug}.jpg`)))
      .map((a) => a.slug);
    expect(missing).toEqual([]);
  });

  it('trang SKU dùng thẻ chia sẻ theo slug, không dùng ảnh sản phẩm tách nền cao hẹp', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/app/(web)/san-pham/[slug]/page.tsx'), 'utf8');
    expect(page).toContain('/images/og/products/${product.slug || product.id}.jpg');
    expect(page).not.toMatch(/toAbsoluteSiteUrl\(product\.images/);
  });

  it('metadata của các trang tĩnh không còn trỏ og/twitter vào ảnh gốc khác tỉ lệ 1200x630', () => {
    const pages = walk(path.join(ROOT, 'src/app')).filter((f) => /[\\/](page|layout)\.tsx$/.test(f) && !/xem-truoc|\[slug\]/.test(f));
    const offenders = pages.flatMap((file) => {
      const text = fs.readFileSync(file, 'utf8');
      return [...text.matchAll(/^\s*(?:url: '|images: ?\[')(?:https:\/\/www\.biathaytu\.com\.vn)?(\/images\/(?!og\/)[^']+)'/gm)]
        .map((m) => `${path.relative(ROOT, file)}: ${m[1]}`);
    });
    expect(offenders).toEqual([]);
  });
});
