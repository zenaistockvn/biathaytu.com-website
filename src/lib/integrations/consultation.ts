import type { ConsultationLead } from '@/lib/consultation/types';

export async function appendConsultationToSheet(lead: ConsultationLead): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!url || !secret) {
    throw new Error('SHEETS_WEBHOOK_URL hoặc SHEETS_WEBHOOK_SECRET chưa được cấu hình');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      type: 'consultation',
      consultation: lead,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    throw new Error(`Google Sheets webhook lỗi ${response.status}: ${responseText.slice(0, 200)}`);
  }

  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!result || result.ok !== true) {
    throw new Error('Google Sheets webhook trả về trạng thái thất bại');
  }
}

export function buildConsultationTelegramMessage(lead: ConsultationLead): string {
  return [
    '🍺 YÊU CẦU TƯ VẤN MỚI',
    '',
    `Sản phẩm: ${lead.productName}`,
    `Khách: ${lead.name}`,
    `SĐT: ${lead.phone}`,
    `Email: ${lead.email || '—'}`,
    `Nội dung: ${lead.content}`,
    `Thời gian: ${lead.createdAtISO}`,
  ].join('\n');
}

export async function sendConsultationToTelegram(lead: ConsultationLead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID chưa được cấu hình');
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildConsultationTelegramMessage(lead),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    throw new Error(`Telegram lỗi ${response.status}: ${responseText.slice(0, 200)}`);
  }
}
