import type { ClientCartItem, PricedItem, OrderTotals } from './types';
import type { Product } from '@/lib/data/products';
import type { PromoCode } from '@/lib/data/promo';

export const AUTO_DISCOUNT_THRESHOLD = 2_000_000;
export const AUTO_DISCOUNT_RATE = 0.05;

/**
 * Tính tiền hoàn toàn từ dữ liệu server. `productLookup` trả Product theo id.
 * Ném lỗi nếu một item không khớp sản phẩm hoặc thiếu giá.
 */
export function calculateOrderTotals(
  items: ClientCartItem[],
  productLookup: (id: string) => Product | null,
  promo: PromoCode | null,
): OrderTotals {
  const priced: PricedItem[] = items.map((item) => {
    const product = productLookup(item.id);
    if (!product || !product.price) {
      throw new Error(`Sản phẩm ${item.name || item.id} không tồn tại hoặc lỗi giá`);
    }
    return {
      id: product.id,
      name: product.name,
      image: item.image,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  const subTotal = priced.reduce((sum, i) => sum + i.subtotal, 0);

  let autoDiscount = 0;
  if (subTotal >= AUTO_DISCOUNT_THRESHOLD) {
    autoDiscount = subTotal * AUTO_DISCOUNT_RATE;
  }

  let promoDiscount = 0;
  let promoCode: string | null = null;
  if (promo) {
    const minOrder = promo.min_order_value ?? 0;
    const notExpired = !promo.expires_at || new Date(promo.expires_at) >= new Date();
    if (notExpired && subTotal >= minOrder) {
      promoCode = promo.code.toUpperCase();
      promoDiscount =
        promo.discount_type === 'percent'
          ? subTotal * (promo.discount_value / 100)
          : promo.discount_value;
    }
  }

  const totalPrice = Math.max(0, subTotal - autoDiscount - promoDiscount);
  return { items: priced, subTotal, autoDiscount, promoDiscount, promoCode, totalPrice };
}
