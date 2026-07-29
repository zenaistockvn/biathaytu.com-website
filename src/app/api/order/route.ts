import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId } from '@/lib/data/products';
import { getActivePromoByCode } from '@/lib/data/promo';
import { validateOrderInput } from '@/lib/orders/validation';
import { calculateOrderTotals } from '@/lib/orders/pricing';
import { appendOrderToSheet } from '@/lib/integrations/googleSheets';
import { sendOrderToTelegram } from '@/lib/integrations/telegram';
import { POLICY_VERSION } from '@/constants/compliance';
import type { OrderCustomer, ClientCartItem, OrderRecord } from '@/lib/orders/types';

// ─── Rate limiting (in-memory) ───────────
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
    const { customer, items, appliedCode, ageVerifiedAt } = body as {
      customer: OrderCustomer;
      items: ClientCartItem[];
      appliedCode?: string;
      ageVerifiedAt?: string;
    };

    // 1. Validate input (gồm kiểm tra checkbox tuổi & điều khoản)
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

    const nowISO = new Date().toISOString();

    const order: OrderRecord = {
      ...totals,
      orderNumber: generateOrderNumber(),
      customer,
      createdAtISO: nowISO,
      age_verified: customer.purchaser_age_confirmed === true && customer.receiver_age_confirmed === true,
      age_verified_at: ageVerifiedAt || nowISO,
      receiver_age_confirmed: Boolean(customer.receiver_age_confirmed),
      alcohol_delivery_required: true,
      policy_version: POLICY_VERSION,
      status: 'age_verified',
      operational_note:
        'Đơn hàng có đồ uống có cồn. Nhân viên giao hàng có quyền yêu cầu giấy tờ xác minh người nhận từ đủ 18 tuổi. Từ chối giao nếu không xác minh được.',
    };

    // 3. Best-effort Google Sheets append
    try {
      await appendOrderToSheet(order);
    } catch (e) {
      console.warn('[ORDER_WEBHOOK_WARN] Sheets append failed:', e);
    }

    // 4. Best-effort Telegram notification
    try {
      await sendOrderToTelegram(order);
    } catch (e) {
      console.warn('[ORDER_WEBHOOK_WARN] Telegram notify failed:', e);
    }

    // 5. Thành công
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order_id: order.orderNumber,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    console.error('Order API Error:', message);
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại.' }, { status: 500 });
  }
}
