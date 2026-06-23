import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId } from '@/lib/data/products';
import { getActivePromoByCode } from '@/lib/data/promo';
import { validateOrderInput } from '@/lib/orders/validation';
import { calculateOrderTotals } from '@/lib/orders/pricing';
import { appendOrderToSheet } from '@/lib/integrations/googleSheets';
import { sendOrderToTelegram } from '@/lib/integrations/telegram';
import type { OrderCustomer, ClientCartItem, OrderRecord } from '@/lib/orders/types';

// ─── Rate limiting (in-memory, đủ cho mức hiện tại) ───────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 5 * 60_000);

function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BTU-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { customer, items, appliedCode } = body as {
      customer: OrderCustomer;
      items: ClientCartItem[];
      appliedCode?: string;
    };

    // 1. Validate input (gồm chặn quantity bất thường)
    const validation = validateOrderInput(customer, items);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 2. Tính tiền hoàn toàn từ dữ liệu server (chống sửa giá)
    const promo = appliedCode ? getActivePromoByCode(appliedCode) : null;
    let totals;
    try {
      totals = calculateOrderTotals(items, getProductBySlugOrId, promo);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Lỗi xác thực sản phẩm';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const order: OrderRecord = {
      ...totals,
      orderNumber: generateOrderNumber(),
      customer,
      createdAtISO: new Date().toISOString(),
    };

    // 3. BẮT BUỘC: ghi Google Sheets (nguồn sự thật). Lỗi → KHÔNG báo thành công.
    try {
      await appendOrderToSheet(order);
    } catch (e) {
      console.error('Sheets append failed:', e);
      return NextResponse.json(
        {
          error:
            'Hệ thống đang bận, chưa lưu được đơn. Vui lòng gọi hotline 0899.191.313 để đặt hàng.',
        },
        { status: 502 },
      );
    }

    // 4. BEST-EFFORT: thông báo Telegram (lỗi không chặn đơn)
    try {
      await sendOrderToTelegram(order);
    } catch (e) {
      console.error('Telegram notify failed:', e);
    }

    // 5. Thành công thật sự
    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    console.error('Order API Error:', message);
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại.' }, { status: 500 });
  }
}
