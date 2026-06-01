import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

describe('public product data regressions', () => {
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

    expect(productCard).toContain("import { useState } from 'react'");
    expect(productCard).toContain('const [imageFailed, setImageFailed] = useState(false)');
    expect(productCard).toContain('onError={() => setImageFailed(true)}');
    expect(productCard).toContain('!imageFailed');
    expect(productCard).toContain('Đang cập nhật hình');
  });
});
