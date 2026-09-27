import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCT_IMAGE_CUTOUTS } from './productImageCutouts';
import { resolveProductImage, hasWhiteCanvas } from './productImages';
import { getAllProducts, getVisibleProducts } from './products';

function publicFileFor(url: string) {
  return path.join(process.cwd(), 'public', decodeURIComponent(url));
}

describe('ảnh sản phẩm đã tách nền trắng', () => {
  it('mọi bản tách nền trong bảng tra đều tồn tại và là WebP', () => {
    const broken = Object.entries(PRODUCT_IMAGE_CUTOUTS).filter(
      ([, cutout]) => !cutout.endsWith('.webp') || !fs.existsSync(publicFileFor(cutout)),
    );
    expect(broken).toEqual([]);
  });

  it('bảng tra không tự trỏ vào chính nó', () => {
    const looping = Object.entries(PRODUCT_IMAGE_CUTOUTS).filter(([source, cutout]) => source === cutout);
    expect(looping).toEqual([]);
  });

  it('không SKU nào còn hiển thị ảnh gốc khi đã có bản tách nền', () => {
    // products.json bị `npm run build` đổ lại từ database, nên dữ liệu có thể quay
    // về đường dẫn ảnh nền trắng bất cứ lúc nào. Phép giải ảnh phải chặn được việc đó.
    const unresolved = getVisibleProducts()
      .flatMap((product) => (product.images ?? []).map((image) => ({ slug: product.slug, image })))
      .filter(({ image }) => resolveProductImage(image) !== image)
      .map(({ slug, image }) => `${slug} → ${image}`);

    expect(unresolved).toEqual([]);
  });

  it('ảnh local đang dùng không còn là JPEG chụp trên nền trắng', () => {
    const stillOriginal = getVisibleProducts()
      .flatMap((product) => (product.images ?? []).map((image) => ({ slug: product.slug, image })))
      .filter(({ image }) => image.startsWith('/images/products/official/') && !image.endsWith('.webp'))
      .map(({ slug, image }) => `${slug} → ${image}`);

    expect(stillOriginal).toEqual([]);
  });

  it('chỉ banner dựng sẵn mới cần hoà nền bằng mix-blend-mode', () => {
    const blended = getVisibleProducts()
      .flatMap((product) => product.images ?? [])
      .filter(hasWhiteCanvas);

    expect(blended.every((image) => image.startsWith('/images/products/official/benediktiner/banners/'))).toBe(true);
    expect(hasWhiteCanvas('/images/products/official/bitburger/bitburger_flasche_05l_frontal_betaut_V12.webp')).toBe(false);
  });

  it('không ảnh sản phẩm nào còn tải từ kho Haravan; mọi ảnh local đều có file', () => {
    const images = getAllProducts().flatMap((product) => (product.images ?? []).map((image) => ({ slug: product.slug, image })));
    expect(images.filter(({ image }) => /hstatic\.net|haravan/i.test(image)).map(({ slug, image }) => `${slug} → ${image}`)).toEqual([]);
    const visible = getVisibleProducts().flatMap((product) => (product.images ?? []).map((image) => ({ slug: product.slug, image })));
    expect(
      visible.filter(({ image }) => image.startsWith('/') && !fs.existsSync(publicFileFor(image))).map(({ slug, image }) => `${slug} → ${image}`),
    ).toEqual([]);
  });
});
