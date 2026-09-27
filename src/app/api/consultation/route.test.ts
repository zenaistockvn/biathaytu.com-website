import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';

const validBody = {
  name: 'Nguyễn Văn A',
  phone: '0915312166',
  email: 'customer@example.com',
  content: 'Tôi cần tư vấn sản phẩm.',
  productName: 'Benediktiner Weissbier',
};

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/consultation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('/api/consultation', () => {
  it('returns 405 for unsupported methods', async () => {
    const response = GET();

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
  });

  it('rejects invalid input before calling integrations', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(createRequest({ ...validBody, phone: '123' }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('bỏ qua yêu cầu có ô bẫy bot "website" mà không gửi đi đâu', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://example.com/lead');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(createRequest({ ...validBody, website: 'spam.example' }));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('trả 503 khi chưa cấu hình kênh nào', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', '');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const response = await POST(createRequest(validBody));
    expect(response.status).toBe(503);
  });

  it('gửi mail qua webhook gt.vn là đủ để báo thành công, kể cả khi chưa có Sheet riêng', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://example.com/lead');
    vi.stubEnv('SHEETS_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', '');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, headers: new Headers({ 'content-type': 'application/json' }) });
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(createRequest({ ...validBody, page: '/san-pham/benediktiner-festbier-ket-24-lon-500ml' }));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/lead');
  });

  it('vẫn thành công khi webhook mail lỗi nhưng Sheet riêng nhận được', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://example.com/lead');
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal('fetch', vi.fn((url: string) => Promise.resolve(
      url.endsWith('/lead')
        ? { ok: false, status: 500, headers: new Headers() }
        : { ok: true, json: async () => ({ ok: true }) },
    )));

    const response = await POST(createRequest(validBody));
    expect(response.status).toBe(200);
  });

  it('returns 502 and never reports success when Sheets fails', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-id');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    }));

    const response = await POST(createRequest(validBody));
    const data = await response.json() as { error?: string; ok?: boolean };

    expect(response.status).toBe(502);
    expect(data.ok).not.toBe(true);
    expect(data.error).toContain('0915 31 21 66');
  });

  it('keeps a persisted lead successful when Telegram fails', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-id');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'error' });
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(createRequest(validBody));
    const data = await response.json() as { ok?: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
