import { NextRequest, NextResponse } from 'next/server';
import { lookupOrderableProduct } from '@/lib/orders/productLookup';
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
  if (requestCounts.size > 500) {
    for (const [key, value] of requestCounts) {
      if (now > value.resetAt) requestCounts.delete(key);
    }
  }
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/** BTU-YYYYMMDD-HHmmss-XXX (XXX = base36) → chống trùng trong cùng ngày. */
function generateOrderNumber(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const time = `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const rand = Math.floor(Math.random() * 46656).toString(36).padStart(3, '0').toUpperCase();
  return `BTU-${date}-${time}-${rand}`;
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

    // Chỉ nhận request cùng origin. Client hợp lệ không gửi Origin (vd. app native) vẫn cho qua.
    const origin = req.headers.get('origin');
    if (origin) {
      const host = req.headers.get('host');
      let originHost: string | null = null;
      try { originHost = new URL(origin).host; } catch { originHost = null; }
      if (!originHost || originHost !== host) {
        return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
      }
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
      totals = calculateOrderTotals(items, lookupOrderableProduct, promo);
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

    // 3. Lưu đơn — BẮT BUỘC ít nhất MỘT kênh thành công, nếu không phải báo lỗi cho khách.
    const failures: string[] = [];
    let persistedTo: 'sheets' | 'telegram' | null = null;

    try {
      await appendOrderToSheet(order);
      persistedTo = 'sheets';
    } catch (e) {
      failures.push(`sheets: ${e instanceof Error ? e.message : String(e)}`);
      console.error('[ORDER_PERSIST_FAIL] sheets', e);
    }

    if (persistedTo === 'sheets') {
      // Telegram chỉ là thông báo → best-effort, không chặn đơn.
      try {
        await sendOrderToTelegram(order);
      } catch (e) {
        console.warn('[ORDER_NOTIFY_WARN] telegram', e);
      }
    } else {
      // Sheets chết → Telegram trở thành kênh LƯU dự phòng, phải gắn cảnh báo nhập tay.
      try {
        await sendOrderToTelegram(
          order,
          '⚠️ ĐƠN CHƯA VÀO GOOGLE SHEET — VUI LÒNG NHẬP TAY NGAY',
        );
        persistedTo = 'telegram';
      } catch (e) {
        failures.push(`telegram: ${e instanceof Error ? e.message : String(e)}`);
        console.error('[ORDER_PERSIST_FAIL] telegram', e);
      }
    }

    // 4. Không kênh nào lưu được → KHÔNG được báo thành công cho khách.
    if (!persistedTo) {
      console.error('[ORDER_LOST] Không lưu được đơn vào bất kỳ kênh nào.', JSON.stringify({ order, failures }));
      return NextResponse.json(
        {
          error:
            'Hệ thống đang bận, chưa lưu được đơn. Vui lòng gọi hotline 0899.191.313 để đặt hàng.',
        },
        { status: 502 },
      );
    }

    // 5. Thành công
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order_id: order.orderNumber,
      persistedTo,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    console.error('Order API Error:', message);
    return NextResponse.json({ error: 'Lỗi server, vui lòng thử lại.' }, { status: 500 });
  }
}
