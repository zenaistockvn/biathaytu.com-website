import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ConsultationLead } from '@/lib/consultation/types';
import {
  appendConsultationToSheet,
  buildConsultationTelegramMessage,
  sendConsultationToTelegram,
} from './consultation';

const lead: ConsultationLead = {
  name: 'Nguyễn Văn A',
  phone: '0915312166',
  email: 'customer@example.com',
  content: 'Tôi cần tư vấn sản phẩm.',
  productName: 'Benediktiner Weissbier',
  createdAtISO: '2026-08-27T00:00:00.000Z',
  source: 'product-consultation',
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('consultation Google Sheets integration', () => {
  it('throws a clear error when required environment variables are missing', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', '');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', '');

    await expect(appendConsultationToSheet(lead)).rejects.toThrow('chưa được cấu hình');
  });

  it('posts the consultation and secret to Sheets', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(appendConsultationToSheet(lead)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/exec',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ secret: 'secret', type: 'consultation', consultation: lead }),
      }),
    );
  });

  it('rejects non-ok HTTP and application responses', async () => {
    vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
    vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    }));
    await expect(appendConsultationToSheet(lead)).rejects.toThrow('Google Sheets webhook lỗi 500');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false }),
    }));
    await expect(appendConsultationToSheet(lead)).rejects.toThrow('trạng thái thất bại');
  });
});

describe('consultation Telegram integration', () => {
  it('builds a plain-text notification containing the lead details', () => {
    const message = buildConsultationTelegramMessage(lead);

    expect(message).toContain(lead.productName);
    expect(message).toContain(lead.name);
    expect(message).toContain(lead.phone);
    expect(message).toContain(lead.content);
  });

  it('posts plain text without parse_mode', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token');
    vi.stubEnv('TELEGRAM_CHAT_ID', 'chat-id');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await expect(sendConsultationToTelegram(lead)).resolves.toBeUndefined();
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(request.body as string) as Record<string, unknown>;
    expect(body.text).toBe(buildConsultationTelegramMessage(lead));
    expect(body).not.toHaveProperty('parse_mode');
  });

  it('throws a clear error when Telegram configuration is missing', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    vi.stubEnv('TELEGRAM_CHAT_ID', '');

    await expect(sendConsultationToTelegram(lead)).rejects.toThrow('chưa được cấu hình');
  });
});
