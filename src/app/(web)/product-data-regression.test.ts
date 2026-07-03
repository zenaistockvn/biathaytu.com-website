import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDisplayProductImage } from './utils/productImages';

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

describe('public product data regressions', () => {
  it('keeps sausage products in the database dump allow-list', () => {
    const dumpScript = readProjectFile('scripts/dump_data.js');

    expect(dumpScript).toContain("['bia', 'vang', 'phu-kien', 'xuc-xich']");
  });

  it('does not request product columns that are absent from the Supabase schema', () => {
    const publicProductPages = [
      'src/app/(web)/page.tsx',
      'src/app/(web)/san-pham/page.tsx',
      'src/app/(web)/san-pham/[slug]/page.tsx',
      'src/app/(web)/kien-thuc/[slug]/page.tsx',
    ];

    for (const path of publicProductPages) {
      expect(readProjectFile(path), path).not.toContain('short_description');
    }
  });

  it('falls back when a product image URL is missing or broken', () => {
    const productCard = readProjectFile('src/app/(web)/components/ProductCard.tsx');

    expect(productCard).toContain('getDisplayProductImage');
    expect(productCard).toContain("import { useState } from 'react'");
    expect(productCard).toContain('const [imageFailed, setImageFailed] = useState(false)');
    expect(productCard).toContain('onError={() => setImageFailed(true)}');
    expect(productCard).toContain('!imageFailed');
    expect(productCard).toContain('Đang cập nhật hình');
  });

  it('replaces known missing product image paths with existing public assets', () => {
    const image = getDisplayProductImage({
      images: ['/images/products/official/bitburger/kostritzer_keg.png'],
      category: 'phu-kien',
    });

    expect(image).not.toContain('kostritzer_keg.png');
    expect(existsSync(join(root, 'public', image.slice(1)))).toBe(true);
  });
});
