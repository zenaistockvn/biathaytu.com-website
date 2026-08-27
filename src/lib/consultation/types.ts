export interface ConsultationInput {
  name: string;
  phone: string;
  email?: string;
  content: string;
  productName?: string;
}

export interface ConsultationLead {
  name: string;
  phone: string;
  email: string;
  content: string;
  productName: string;
  createdAtISO: string;
  source: 'product-consultation';
}
