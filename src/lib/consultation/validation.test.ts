import { describe, expect, it } from 'vitest';
import { normalizeVietnamesePhone, validateConsultationInput } from './validation';

describe('consultation validation', () => {
  it('normalizes spaces and dots in Vietnamese phone numbers', () => {
    expect(normalizeVietnamesePhone('0915 31.21.66')).toBe('0915312166');
  });

  it.each(['0915312166', '+84915312166'])('accepts valid Vietnamese phone %s', (phone) => {
    const result = validateConsultationInput({
      name: 'Nguyễn Văn A',
      phone,
      email: '',
      content: 'Tôi cần tư vấn sản phẩm.',
      productName: 'Benediktiner Weissbier',
    });

    expect(result.ok).toBe(true);
  });

  it('trims fields and returns normalized data', () => {
    const result = validateConsultationInput({
      name: '  Nguyễn Văn A  ',
      phone: '0915 31 21 66',
      email: ' customer@example.com ',
      content: '  Cần tư vấn. ',
      productName: '  Benediktiner  ',
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: 'Nguyễn Văn A',
        phone: '0915312166',
        email: 'customer@example.com',
        content: 'Cần tư vấn.',
        productName: 'Benediktiner',
      },
    });
  });

  it.each([
    [{ phone: '0915312166', content: 'Cần tư vấn.' }, 'name'],
    [{ name: 'A', phone: '12345', content: 'Cần tư vấn.' }, 'phone'],
    [{ name: 'A', phone: '0915312166', email: 'sai-email', content: 'Cần tư vấn.' }, 'email'],
    [{ name: 'A', phone: '0915312166', content: '   ' }, 'content'],
  ])('rejects invalid input and identifies field %#', (input, field) => {
    const result = validateConsultationInput(input);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.field).toBe(field);
  });
});
