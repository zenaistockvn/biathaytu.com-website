import type { OrderCustomer, ClientCartItem } from './types';

const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;
export const MAX_QUANTITY_PER_ITEM = 99;

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateOrderInput(
  customer: OrderCustomer | undefined,
  items: ClientCartItem[] | undefined,
): ValidationResult {
  if (!customer?.name || !customer?.phone || !customer?.address || !items || items.length === 0) {
    return { ok: false, error: 'Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc' };
  }
  if (customer.name.trim().length < 2) {
    return { ok: false, error: 'Tên người đặt không hợp lệ' };
  }
  if (!PHONE_REGEX.test(customer.phone)) {
    return { ok: false, error: 'Số điện thoại người đặt không hợp lệ' };
  }

  // Validate purchaser & receiver age confirmations
  if (customer.purchaser_age_confirmed === false) {
    return { ok: false, error: 'Bạn phải xác nhận người đặt hàng từ đủ 18 tuổi trở lên' };
  }
  if (customer.receiver_age_confirmed === false) {
    return { ok: false, error: 'Bạn phải xác nhận người nhận hàng từ đủ 18 tuổi trở lên' };
  }
  if (customer.terms_agreed === false) {
    return { ok: false, error: 'Bạn phải đồng ý với điều khoản bán hàng và chính sách bảo mật' };
  }

  // Validate receiver phone if provided
  if (customer.receiverPhone && !PHONE_REGEX.test(customer.receiverPhone)) {
    return { ok: false, error: 'Số điện thoại người nhận không hợp lệ' };
  }

  for (const item of items) {
    const q = item.quantity;
    if (
      !item.id ||
      typeof q !== 'number' ||
      !Number.isInteger(q) ||
      q < 1 ||
      q > MAX_QUANTITY_PER_ITEM
    ) {
      return { ok: false, error: `Số lượng không hợp lệ cho sản phẩm ${item.name || item.id}` };
    }
  }
  return { ok: true };
}
