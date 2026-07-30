import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getVisibleProducts, getAllProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';

function localFileFor(url: string) {
  return path.join(process.cwd(), 'public', decodeURIComponent(url));
}

describe('toàn vẹn asset ảnh', () => {
  it('mọi ảnh của SKU ĐANG BÁN đều tồn tại trong public/', () => {
    const urls = getVisibleProducts()
      .flatMap((p) => p.images ?? [])
      .filter((u) => u.startsWith('/'));

    const missing = urls.filter((u) => !fs.existsSync(localFileFor(u)));
    expect(missing).toEqual([]);
  });

  it('SKU bị ẩn giữ nguyên đường dẫn ảnh THẬT — không được trỏ sang ảnh thương hiệu khác', () => {
    // Nợ kỹ thuật phải nhìn thấy được: SKU ẩn vẫn trỏ tới file còn thiếu,
    // để khi có ảnh chính hãng thì chỉ cần bỏ slug khỏi HIDDEN_PRODUCT_SLUGS.
    const hidden = getAllProducts().filter((p) => HIDDEN_PRODUCT_SLUGS.has(p.slug));
    expect(hidden.length).toBe(HIDDEN_PRODUCT_SLUGS.size);
    for (const p of hidden) {
      for (const img of p.images ?? []) {
        const filename = img.split('/').pop() || img;
        expect(filename, `${p.slug} không được dùng ảnh Bitburger`).not.toMatch(/bitb|bitburger/i);
      }
    }
  });

  it('mọi ảnh hardcode trong component đều tồn tại', () => {
    const dir = path.join(process.cwd(), 'src');
    const files: string[] = [];
    (function walk(d: string) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.tsx?$/.test(e.name)) files.push(p);
      }
    })(dir);

    const missing: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      for (const m of src.matchAll(/src="(\/[^"]+\.(?:png|jpe?g|webp|svg|avif))"/g)) {
        if (!fs.existsSync(localFileFor(m[1]))) missing.push(`${path.relative(process.cwd(), f)} → ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
