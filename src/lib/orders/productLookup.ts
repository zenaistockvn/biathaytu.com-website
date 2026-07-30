import { getProductBySlugOrId, HIDDEN_PRODUCT_SLUGS } from '@/lib/data/products';
import type { Product } from '@/lib/data/products';

/**
 * Tra sản phẩm cho luồng ĐẶT HÀNG. Trả null với SKU đang ẩn để giỏ hàng cũ
 * (localStorage) không thể đặt được sản phẩm đã ngừng bán.
 */
export function lookupOrderableProduct(key: string): Product | null {
  const product = getProductBySlugOrId(key);
  if (!product) return null;
  if (product.hidden || HIDDEN_PRODUCT_SLUGS.has(product.slug)) return null;
  return product;
}
