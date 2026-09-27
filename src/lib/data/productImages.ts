import { PRODUCT_IMAGE_CUTOUTS } from './productImageCutouts';

/**
 * Database còn trỏ vài ảnh vào kho Haravan cũ (product.hstatic.net). Site không tải ảnh từ đó nữa:
 * mỗi ảnh có bản lưu trong repo. Chai vang lấy bản tách nền từ dự án gt.vn; ly và đồ mở bia
 * không có ảnh khác nên giữ banner gốc, lưu tại /images/products/official/benediktiner/banners/.
 */
const HARAVAN_LOCAL_COPIES: Readonly<Record<string, string>> = {
  'https://product.hstatic.net/200000919029/product/37_96f13f655e1e4889a99e3a5ba481cef9_grande.jpg': '/images/products/official/thorle/sauvignon_blanc_magnum_bottle.webp',
  'https://product.hstatic.net/200000919029/product/39_a92d1e96ff494d00bacc4de70b3ba5ca_grande.jpg': '/images/products/official/thorle/riesling_magnum_bottle.webp',
  'https://product.hstatic.net/200000919029/product/48_b9080ea57a1740e480c7d8fbcd61bbf4_grande.jpg': '/images/products/official/thorle/austernkalk_magnum_bottle.webp',
  'https://product.hstatic.net/200000919029/product/ly-benediktiner-chinh-hang-1_16a95d30eaa24ad0a6df3dc4c82ec1d1.png': '/images/products/official/benediktiner/banners/benediktiner-bo-6-coc.webp',
  'https://product.hstatic.net/200000919029/product/124_43ed2d310d7b45a6a7c3cd065e139b25.png': '/images/products/official/benediktiner/banners/benediktiner-mo-bia.webp',
};

/**
 * Ảnh sản phẩm trong database vẫn trỏ vào bản gốc chụp trên nền trắng hoặc kho Haravan, còn repo
 * đã có bản WebP tách nền / bản lưu riêng. `npm run build` đổ lại products.json từ database nên
 * không thể sửa một lần trong JSON là xong — mọi ảnh phải đi qua đây khi render.
 */
export function resolveProductImage(image: string): string {
  const trimmed = image.trim();
  return PRODUCT_IMAGE_CUTOUTS[trimmed] ?? HARAVAN_LOCAL_COPIES[trimmed] ?? trimmed;
}

export function resolveProductImages(images: string[] | null): string[] | null {
  if (!images) return images;
  return images.map(resolveProductImage);
}

/**
 * Banner 1080x1080 dựng sẵn (chữ, huy hiệu, mặt bàn gỗ) không tách nền được, nên card hoà
 * phần nền đó vào khoang ảnh bằng mix-blend-mode thay vì cắt.
 */
export function hasWhiteCanvas(image: string | null | undefined): boolean {
  return Boolean(image && image.trim().startsWith('/images/products/official/benediktiner/banners/'));
}
