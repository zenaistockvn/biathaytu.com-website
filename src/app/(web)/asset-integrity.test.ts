import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getVisibleProducts, getAllProducts, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';

function localFileFor(url: string) {
  return path.join(process.cwd(), 'public', decodeURIComponent(url));
}

const LOCAL_IMAGE_PATH = /\/images\/[^"'<>]+?\.(?:png|jpe?g|webp|svg|avif)/gi;
const SAFE_LOCAL_IMAGE_PATH = /^\/[a-z0-9\/_.-]+$/;

// Product data still contains official filenames supplied by the breweries and
// one intentionally missing hidden SKU image. Keep that existing debt visible
// without allowing new non-ASCII or missing paths into any src/data JSON file.
const LEGACY_DATA_IMAGE_EXCEPTIONS = new Set([
  '/images/products/official/bitburger/bitburger_flasche_05l_frontal_betaut_V12.jpg',
  '/images/products/official/benediktiner/86312_Bene_Festbier_Dosenkarton_4x05l_schraeg_links.jpg',
  '/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.jpg',
  '/images/products/official/bitburger/flasche_longneck_033l_pils_frontal_betaut_V8.jpg',
  '/images/products/official/bitburger/90160_Bitburger_05l_Dose_frontal_unbetaut_LG.jpg',
  '/images/products/official/bitburger/74560_Bitb_Pils_05l_Flasche_Pokal_frontal_betaut_142x291mm.jpg',
  '/images/products/official/bitburger/88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg',
  '/images/products/official/bitburger/kostritzer_keg.png',
]);

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

describe('toàn vẹn asset ảnh', () => {
  it('mọi đường dẫn ảnh mới trong src/data/*.json đều an toàn và tồn tại', () => {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const references: Array<{ file: string; url: string }> = [];

    for (const file of fs.readdirSync(dataDir).filter((name) => name.endsWith('.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')) as unknown;
      for (const value of collectStrings(data)) {
        for (const match of value.matchAll(LOCAL_IMAGE_PATH)) {
          references.push({ file, url: match[0] });
        }
      }
    }

    const guarded = references.filter(({ url }) => !LEGACY_DATA_IMAGE_EXCEPTIONS.has(url));
    const unsafe = guarded
      .filter(({ url }) => !SAFE_LOCAL_IMAGE_PATH.test(url))
      .map(({ file, url }) => `${file} → ${url}`);
    const missing = guarded
      .filter(({ url }) => !fs.existsSync(localFileFor(url)))
      .map(({ file, url }) => `${file} → ${url}`);

    expect(unsafe).toEqual([]);
    expect(missing).toEqual([]);
  });

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
