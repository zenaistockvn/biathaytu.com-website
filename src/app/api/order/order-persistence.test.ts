import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import productsData from '@/data/products.json';

const REAL_PRODUCT = (productsData as Array<{ id: string; slug: string; price: number | null }>)
  .find((p) => p.slug === 'benediktiner-naturtrub-thung-12-chai-500ml')!;

const SHEETS_URL = 'https://script.google.com/macros/s/TEST/exec';

function makeRequest(ip: string) {
  return new NextRequest('http://localhost:3000/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify({
      customer: {
        name: 'Nguyen Van A',
        phone: '0912345678',
        address: '659A Lạc Long Quân, Hà Nội',
        purchaser_age_confirmed: true,
        receiver_age_confirmed: true,
        terms_agreed: true,
      },
      items: [{ id: REAL_PRODUCT.id, name: 'Bia', image: '', price: 1, quantity: 1 }],
    }),
  });
}

/** Ghi lại mọi payload gửi tới Telegram để assert banner cảnh báo. */
const telegramPayloads: string[] = [];

function stubChannels(sheets: 'ok' | 'fail', telegram: 'ok' | 'fail') {
  telegramPayloads.length = 0;
  vi.stubEnv('SHEETS_WEBHOOK_URL', SHEETS_URL);
  vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token');
  vi.stubEnv('TELEGRAM_CHAT_ID', '-100');

  vi.stubGlobal('fetch', vi.fn(async (input: unknown, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    if (url.includes('script.google.com')) {
      if (sheets === 'fail') throw new Error('sheets network down');
      return { ok: true, json: async () => ({ ok: true }), text: async () => '' } as unknown as Response;
    }
    if (url.includes('api.telegram.org')) {
      telegramPayloads.push(String(init?.body ?? ''));
      if (telegram === 'fail') throw new Error('telegram network down');
      return { ok: true, json: async () => ({ ok: true }), text: async () => '' } as unknown as Response;
    }
    throw new Error('fetch ngoài dự kiến: ' + url);
  }));
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('POST /api/order — không được im lặng làm mất đơn', () => {
  it('Sheets ok → 200 và persistedTo = "sheets"', async () => {
    stubChannels('ok', 'ok');
    const res = await POST(makeRequest('10.0.0.1'));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.persistedTo).toBe('sheets');
  });

  it('Sheets lỗi + Telegram ok → 200, persistedTo = "telegram", có banner cảnh báo nhập tay', async () => {
    stubChannels('fail', 'ok');
    const res = await POST(makeRequest('10.0.0.2'));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.persistedTo).toBe('telegram');
    expect(telegramPayloads.join('')).toMatch(/CHƯA VÀO GOOGLE SHEET/i);
  });

  it('CẢ HAI kênh lỗi → 502, KHÔNG có success, thông báo kèm hotline', async () => {
    stubChannels('fail', 'fail');
    const res = await POST(makeRequest('10.0.0.3'));
    const body = await res.json();
    expect(res.status).toBe(502);
    expect(body.success).toBeUndefined();
    expect(body.orderNumber).toBeUndefined();
    expect(body.error).toMatch(/0899\.?191\.?313/);
  });

  it('Cả hai kênh lỗi → ghi [ORDER_LOST] ra console.error để còn cứu đơn từ log', async () => {
    stubChannels('fail', 'fail');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await POST(makeRequest('10.0.0.4'));
    expect(spy.mock.calls.flat().join(' ')).toContain('[ORDER_LOST]');
    spy.mockRestore();
  });
});

describe('generateOrderNumber — chống trùng mã', () => {
  it('đúng định dạng BTU-YYYYMMDD-HHmmss-XXX và không trùng trong 500 lần sinh', async () => {
    stubChannels('ok', 'ok');
    const numbers = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const res = await POST(makeRequest('10.0.1.' + (i % 200)));
      if (res.status !== 200) continue;
      const { orderNumber } = await res.json();
      expect(orderNumber).toMatch(/^BTU-\d{8}-\d{6}-[0-9A-Z]{3}$/);
      numbers.add(orderNumber);
    }
    expect(numbers.size).toBeGreaterThan(400);
  });
});
