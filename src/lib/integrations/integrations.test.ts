import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendOrderToSheet } from './googleSheets';
import { buildTelegramMessage, sendOrderToTelegram } from './telegram';
import { POLICY_VERSION } from '@/constants/compliance';
import type { OrderRecord } from '@/lib/orders/types';

const order: OrderRecord = {
  orderNumber: 'BTU-20260614-120000-A1B',
  createdAtISO: '2026-06-14T00:00:00.000Z',
  customer: {
    name: 'Nguyễn Văn A', phone: '0912345678', address: 'Hà Nội',
    purchaser_age_confirmed: true, receiver_age_confirmed: true, terms_agreed: true,
  },
  items: [{ id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2, subtotal: 200000 }],
  subTotal: 200000, autoDiscount: 0, promoDiscount: 0, promoCode: null, totalPrice: 200000,
  age_verified: true,
  age_verified_at: '2026-06-14T00:00:00.000Z',
  receiver_age_confirmed: true,
  alcohol_delivery_required: true,
  policy_version: POLICY_VERSION,
  status: 'age_verified',
  operational_note: 'Đơn hàng có đồ uống có cồn.',
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('integrations/googleSheets', () => {
  it('throws when env is missing', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', '');
    await expect(appendOrderToSheet(order)).rejects.toThrow();
  });

  it('throws when the webhook returns non-ok', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'err' }));
    await expect(appendOrderToSheet(order)).rejects.toThrow();
  });

  it('resolves when the webhook returns ok:true', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));
    await expect(appendOrderToSheet(order)).resolves.toBeUndefined();
  });

  it('payload gửi Google Sheets mang đủ trường compliance', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);

    await appendOrderToSheet(order);

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.secret).toBe('s');
    expect(sent.order.age_verified).toBe(true);
    expect(sent.order.receiver_age_confirmed).toBe(true);
    expect(sent.order.alcohol_delivery_required).toBe(true);
    expect(sent.order.policy_version).toBe(POLICY_VERSION);
    expect(sent.order.age_verified_at).toBeTruthy();
  });
});

describe('integrations/telegram', () => {
  it('builds a plain-text message with order number and customer name', () => {
    const msg = buildTelegramMessage(order);
    expect(msg).toContain('BTU-20260614-120000-A1B');
    expect(msg).toContain('Nguyễn Văn A');
    expect(msg).toContain('Bia A');
  });

  it('throws when env is missing', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    await expect(sendOrderToTelegram(order)).rejects.toThrow();
  });

  it('banner cảnh báo xuất hiện ở đầu tin Telegram khi được truyền', () => {
    const msg = buildTelegramMessage(order, '⚠️ ĐƠN CHƯA VÀO GOOGLE SHEET — VUI LÒNG NHẬP TAY NGAY');
    expect(msg.split('\n')[0]).toMatch(/CHƯA VÀO GOOGLE SHEET/);
  });
});
