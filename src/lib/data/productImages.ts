import { PRODUCT_IMAGE_CUTOUTS } from './productImageCutouts';

/**
 * Ảnh sản phẩm trong database vẫn trỏ vào bản gốc chụp trên nền trắng, còn repo
 * đã có bản WebP tách nền. `npm run build` đổ lại products.json từ database nên
 * không thể sửa một lần trong JSON là xong — mọi ảnh phải đi qua đây khi render.
 */
export function resolveProductImage(image: string): string {
  const trimmed = image.trim();
  return PRODUCT_IMAGE_CUTOUTS[trimmed] ?? trimmed;
}

export function resolveProductImages(images: string[] | null): string[] | null {
  if (!images) return images;
  return images.map(resolveProductImage);
}

/**
 * Ảnh Haravan còn lại là banner 1080x1080 dựng sẵn: chữ, huy hiệu và mặt bàn gỗ
 * đặt trên khung nền trắng. Tách nền sẽ vỡ bố cục, nên card hoà mảng trắng đó
 * vào khoang ảnh bằng mix-blend-mode thay vì cắt.
 */
export function hasWhiteCanvas(image: string | null | undefined): boolean {
  return Boolean(image && /^https:\/\/product\.hstatic\.net\//.test(image.trim()));
}
