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
    return { ok: false, error: 'Tên không hợp lệ' };
  }
  if (!PHONE_REGEX.test(customer.phone)) {
    return { ok: false, error: 'Số điện thoại không hợp lệ' };
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
