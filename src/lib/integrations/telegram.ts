import type { OrderRecord } from '@/lib/orders/types';
import { formatPrice } from '@/utils/formatPrice';

/** Text THUẦN (không parse_mode) → an toàn trước injection. */
export function buildTelegramMessage(order: OrderRecord): string {
  const lines = [
    `🍺 ĐƠN HÀNG MỚI: ${order.orderNumber}`,
    ``,
    `Khách: ${order.customer.name}`,
    `SĐT: ${order.customer.phone}`,
    `Email: ${order.customer.email || '—'}`,
    `Địa chỉ: ${order.customer.address}`,
    `Ghi chú: ${order.customer.note || '—'}`,
    ``,
    `Sản phẩm:`,
    ...order.items.map((i) => `• ${i.name} x${i.quantity} = ${formatPrice(i.subtotal)}`),
    ``,
    `Tạm tính: ${formatPrice(order.subTotal)}`,
  ];
  if (order.autoDiscount > 0) lines.push(`Giảm 5%: -${formatPrice(order.autoDiscount)}`);
  if (order.promoDiscount > 0) lines.push(`Mã ${order.promoCode}: -${formatPrice(order.promoDiscount)}`);
  lines.push(`TỔNG: ${formatPrice(order.totalPrice)}`);
  return lines.join('\n');
}

/** Best-effort: caller bắt lỗi và KHÔNG chặn đơn nếu thất bại. */
export async function sendOrderToTelegram(order: OrderRecord): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID chưa được cấu hình');
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(order),
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Telegram lỗi ${res.status}: ${text.slice(0, 200)}`);
  }
}
