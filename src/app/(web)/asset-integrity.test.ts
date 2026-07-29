import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getAllProducts } from '@/lib/data/products';

function localFileFor(url: string) {
  return path.join(process.cwd(), 'public', decodeURIComponent(url));
}

describe('toàn vẹn asset ảnh', () => {
  it('mọi ảnh sản phẩm nội bộ đều tồn tại trong public/', () => {
    const urls = getAllProducts()
      .flatMap((p) => p.images ?? [])
      .filter((u) => u.startsWith('/'));

    const missing = urls.filter((u) => !fs.existsSync(localFileFor(u)));
    expect(missing).toEqual([]);
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
