import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDisplayProductImage } from './utils/productImages';

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

describe('public product data regressions', () => {
  it('không đổ xúc xích từ database (The Wurst ngừng cung cấp 09/2026)', () => {
    const dumpScript = readProjectFile('scripts/dump_data.js');

    expect(dumpScript).toContain("['bia', 'vang', 'phu-kien']");
  });

  it('keeps the public catalog focused on Benediktiner and other German beers', () => {
    const productsPage = readProjectFile('src/app/(web)/san-pham/page.tsx');

    expect(productsPage).toContain('getBeerProducts');
    // Nhóm Benediktiner / Bia Đức tuyển chọn → dòng bia (audit A2); tên nhóm ở src/config/productLines.ts.
    expect(productsPage).toContain('LINE_GROUPS');
    expect(readProjectFile('src/config/productLines.ts')).toContain('Bộ sưu tập Benediktiner');
    expect(productsPage).not.toContain('getSausageProducts');
    expect(productsPage).not.toContain('getComboProducts');
    expect(productsPage).not.toContain("getProductsByCategory('vang')");
  });

  it('shows the approved retail price without promotional styling', () => {
    const productsPage = readProjectFile('src/app/(web)/san-pham/page.tsx');
    const productCard = readProjectFile('src/app/(web)/components/ProductCard.tsx');

    expect(productsPage).not.toContain('highlightLabel');
    expect(productCard).toContain('formatPrice');
    expect(productCard).toContain('Giá bán lẻ');
    expect(productCard).not.toContain('card-price-current');
    expect(productCard).toContain('Xem sản phẩm');
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

  it('uses category fallback image when product image is empty', () => {
    const image = getDisplayProductImage({
      images: [],
      category: 'phu-kien',
    });

    expect(image).not.toBeNull();
    expect(existsSync(join(root, 'public', image!.slice(1)))).toBe(true);
  });

  it('trang sản phẩm không còn gợi ý xúc xích hay combo', () => {
    const productDetailPage = readProjectFile('src/app/(web)/san-pham/[slug]/page.tsx');
    const productDetailsAccordion = readProjectFile(
      'src/app/(web)/components/ProductDetailsAccordion.tsx',
    );

    for (const source of [productDetailPage, productDetailsAccordion]) {
      expect(source).not.toMatch(/xuc-xich|The Wurst|getSausageProducts|getRelatedCombo/);
    }
    expect(productDetailPage).toContain('category={product.category}');
  });
});
