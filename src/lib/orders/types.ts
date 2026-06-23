export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
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

export interface OrderRecord extends OrderTotals {
  orderNumber: string;
  customer: OrderCustomer;
  createdAtISO: string;
}
