import type { ConsultationInput } from './types';

export type ConsultationValidationResult =
  | { ok: true; data: Required<ConsultationInput> }
  | { ok: false; error: string; field?: keyof ConsultationInput };

const VIETNAMESE_PHONE_PATTERN = /^(0|\+84)[0-9]{8,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeVietnamesePhone(value: string): string {
  return value.replace(/[\s.]/g, '');
}

export function validateConsultationInput(input: unknown): ConsultationValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Dữ liệu gửi lên không hợp lệ.' };
  }

  const candidate = input as Partial<Record<keyof ConsultationInput, unknown>>;
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : '';
  const rawPhone = typeof candidate.phone === 'string' ? candidate.phone.trim() : '';
  const phone = normalizeVietnamesePhone(rawPhone);
  const email = typeof candidate.email === 'string' ? candidate.email.trim() : '';
  const content = typeof candidate.content === 'string' ? candidate.content.trim() : '';
  const productName = typeof candidate.productName === 'string' ? candidate.productName.trim() : '';

  if (!name) return { ok: false, field: 'name', error: 'Vui lòng nhập họ và tên.' };
  if (name.length > 120) return { ok: false, field: 'name', error: 'Họ và tên không được vượt quá 120 ký tự.' };
  if (!VIETNAMESE_PHONE_PATTERN.test(phone)) {
    return { ok: false, field: 'phone', error: 'Số điện thoại Việt Nam không hợp lệ.' };
  }
  if (email && (!EMAIL_PATTERN.test(email) || email.length > 254)) {
    return { ok: false, field: 'email', error: 'Địa chỉ email không hợp lệ.' };
  }
  if (!content) return { ok: false, field: 'content', error: 'Vui lòng nhập nội dung cần tư vấn.' };
  if (content.length > 2000) return { ok: false, field: 'content', error: 'Nội dung tư vấn không được vượt quá 2.000 ký tự.' };

  return {
    ok: true,
    data: {
      name,
      phone,
      email,
      content,
      productName: productName.slice(0, 200) || 'Sản phẩm chưa xác định',
    },
  };
}
