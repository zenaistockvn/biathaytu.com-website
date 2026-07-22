export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  receiverName?: string;
  receiverPhone?: string;
  purchaser_age_confirmed?: boolean;
  receiver_age_confirmed?: boolean;
  terms_agreed?: boolean;
}

/** Item gửi từ client — KHÔNG tin `price`. */
export interface ClientCartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

/** Item sau khi đối chiếu giá từ dữ liệu server. */
export interface PricedItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTotals {
  items: PricedItem[];
  subTotal: number;
  autoDiscount: number;
  promoDiscount: number;
  promoCode: string | null;
  totalPrice: number;
}

export type OrderBusinessStatus =
  | 'pending_age_verification'
  | 'age_verified'
  | 'delivery_refused_underage';

export interface OrderRecord extends OrderTotals {
  orderNumber: string;
  customer: OrderCustomer;
  createdAtISO: string;
  age_verified: boolean;
  age_verified_at: string;
  receiver_age_confirmed: boolean;
  alcohol_delivery_required: boolean;
  policy_version: string;
  status: OrderBusinessStatus;
  operational_note: string;
}
