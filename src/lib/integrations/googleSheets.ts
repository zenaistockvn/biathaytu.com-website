import type { OrderRecord } from '@/lib/orders/types';

/**
 * Ghi đơn vào Google Sheets qua Apps Script Web App.
 * Ném lỗi nếu thiếu cấu hình hoặc webhook không trả { ok: true }.
 * Caller PHẢI coi lỗi ở đây là "đơn chưa được lưu".
 */
export async function appendOrderToSheet(order: OrderRecord): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) {
    throw new Error('SHEETS_WEBHOOK_URL hoặc SHEETS_WEBHOOK_SECRET chưa được cấu hình');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, order }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google Sheets webhook lỗi ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!data || data.ok !== true) {
    throw new Error('Google Sheets webhook trả về trạng thái thất bại');
  }
}
