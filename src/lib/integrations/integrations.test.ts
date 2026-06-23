import { afterEach, describe, expect, it, vi } from 'vitest';
import { appendOrderToSheet } from './googleSheets';
import { buildTelegramMessage, sendOrderToTelegram } from './telegram';
import type { OrderRecord } from '@/lib/orders/types';

const order: OrderRecord = {
  orderNumber: 'BTU-20260614-1234',
  createdAtISO: '2026-06-14T00:00:00.000Z',
  customer: { name: 'Nguyễn Văn A', phone: '0912345678', address: 'Hà Nội' },
  items: [{ id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2, subtotal: 200000 }],
  subTotal: 200000, autoDiscount: 0, promoDiscount: 0, promoCode: null, totalPrice: 200000,
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
});

describe('integrations/telegram', () => {
  it('builds a plain-text message with order number and customer name', () => {
    const msg = buildTelegramMessage(order);
    expect(msg).toContain('BTU-20260614-1234');
    expect(msg).toContain('Nguyễn Văn A');
    expect(msg).toContain('Bia A');
  });

  it('throws when env is missing', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    await expect(sendOrderToTelegram(order)).rejects.toThrow();
  });
});
