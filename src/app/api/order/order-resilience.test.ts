import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

describe('khả năng phục hồi pipeline đặt hàng API', () => {
  it('trả về thành công ngay cả khi webhook bên ngoài thất bại', async () => {
    // Mock global fetch to simulate webhook failure
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Webhook timeout/network error'));

    const req = new Request('http://localhost:3000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Nguyen Van A',
          phone: '0915312166',
          address: '123 Hang Bai, Hoan Kiem, Ha Noi',
          purchaser_age_confirmed: true,
          receiver_age_confirmed: true,
          terms_agreed: true,
        },
        items: [
          {
            id: 'benediktiner-naturtrub-thung-12-chai-500ml',
            name: 'Benediktiner Weissbier 500ml',
            price: 1150000,
            quantity: 2,
          },
        ],
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.order_id).toBeDefined();

    globalThis.fetch = originalFetch;
  });
});
