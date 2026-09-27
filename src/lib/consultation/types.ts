export interface ConsultationInput {
  name: string;
  phone: string;
  email?: string;
  content: string;
  productName?: string;
  /** Trang khách đang xem khi gửi (đường dẫn tương đối). */
  page?: string;
}

export interface ConsultationLead {
  name: string;
  phone: string;
  email: string;
  content: string;
  productName: string;
  page: string;
  createdAtISO: string;
  source: 'product-consultation';
}
