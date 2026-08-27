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

  it('returns 502 and never reports success when Sheets fails', async () => {
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
