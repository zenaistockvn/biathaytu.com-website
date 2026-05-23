import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminSupabase } from '@/lib/supabase/server';
import { formatPrice } from '@/utils/formatPrice';

// ─── Rate Limiting ─────────────────────────────────────────
// [S2 FIX] Simple in-memory rate limiter (10 requests/min/IP)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
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

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 5 * 60_000);

// ─── Promo Codes ──────────────────────────────────────────
// Promo codes are now fetched dynamically from Supabase public.promo_codes table

// ─── Types ────────────────────────────────────────────────
interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ValidatedItem extends OrderItem {
  subtotal: number;
}

// ─── Helpers ──────────────────────────────────────────────
function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BTU-${yyyy}${mm}${dd}-${randomSuffix}`;
}

// ─── Main Handler ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // [S2] Rate limit check
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { customer, items, appliedCode } = body as {
      customer: OrderCustomer;
      items: OrderItem[];
      appliedCode?: string;
    };

    // 1. Validate Input
    if (!customer?.name || !customer?.phone || !customer?.address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc' }, { status: 400 });
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    if (customer.name.trim().length < 2) {
      return NextResponse.json({ error: 'Tên không hợp lệ' }, { status: 400 });
    }

    const supabase = createAdminSupabase();

    // 2. Re-validate prices against DB to prevent tampering
    const productIds = items.map((item) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      console.error('Error fetching products for validation:', dbError);
      return NextResponse.json({ error: 'Lỗi xác thực sản phẩm' }, { status: 500 });
    }

    let calculatedSubTotal = 0;
    const validatedItems: ValidatedItem[] = items.map((clientItem) => {
      const dbProduct = dbProducts.find(p => p.id === clientItem.id);
      if (!dbProduct || !dbProduct.price) {
        throw new Error(`Sản phẩm ${clientItem.name} không tồn tại hoặc lỗi giá`);
      }
      const subtotal = dbProduct.price * clientItem.quantity;
      calculatedSubTotal += subtotal;
      return {
        ...clientItem,
        price: dbProduct.price,
        subtotal,
      };
    });

    // 3. Server-side discount calculation
    let calcAutoDiscount = 0;
    if (calculatedSubTotal >= 2000000) {
      calcAutoDiscount = calculatedSubTotal * 0.05;
    }

    let calcPromoDiscount = 0;
    const validatedCode = appliedCode?.trim().toUpperCase();
    if (validatedCode) {
      // Query promo code dynamically from Supabase
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes' as never)
        .select('*' as never)
        .eq('code' as never, validatedCode as never)
        .eq('is_active' as never, true as never)
        .single();

      if (!promoError && promoData) {
        const promo = promoData as {
          discount_type: 'percent' | 'amount';
          discount_value: number;
          min_order_value?: number;
          expires_at?: string | null;
        };

        const now = new Date();
        const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
        const minOrderValue = promo.min_order_value || 0;

        if ((!expiresAt || now <= expiresAt) && calculatedSubTotal >= minOrderValue) {
          if (promo.discount_type === 'percent') {
            calcPromoDiscount = calculatedSubTotal * (promo.discount_value / 100);
          } else if (promo.discount_type === 'amount') {
            calcPromoDiscount = promo.discount_value;
          }
        }
      }
    }

    const calcTotalDiscount = calcAutoDiscount + calcPromoDiscount;
    const calcTotalPrice = Math.max(0, calculatedSubTotal - calcTotalDiscount);

    // 4. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 5. Insert order into DB
    // Note: Using .from() with untyped table — will be resolved when DB types are regenerated
    const { data: orderData, error: insertOrderError } = await (supabase as ReturnType<typeof createAdminSupabase>)
      .from('orders' as never)
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        customer_address: customer.address,
        customer_note: customer.note || null,
        sub_total: calculatedSubTotal,
        auto_discount: calcAutoDiscount,
        promo_discount: calcPromoDiscount,
        promo_code: validatedCode || null,
        total_price: calcTotalPrice,
        status: 'new',
        email_sent: false,
      } as never)
      .select('id')
      .single();

    if (insertOrderError || !orderData) {
      console.error('Insert Order Error:', insertOrderError);
      return NextResponse.json({ error: 'Không thể tạo đơn hàng trong hệ thống' }, { status: 500 });
    }

    const orderId = (orderData as { id: string }).id;

    // 6. Insert order items
    const itemsToInsert = validatedItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: insertItemsError } = await (supabase as ReturnType<typeof createAdminSupabase>)
      .from('order_items' as never)
      .insert(itemsToInsert as never);

    if (insertItemsError) {
      console.error('Insert Order Items Error:', insertItemsError);
    }

    // 7. Send Email (Best Effort)
    let emailSent = false;
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const itemsHtml = validatedItems.map((item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.subtotal)}</td>
          </tr>
        `).join('');

        let discountHtml = '';
        if (calcTotalDiscount > 0) {
          discountHtml += `
            <tr>
              <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Tạm tính:</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(calculatedSubTotal)}</td>
            </tr>
          `;
          if (calcAutoDiscount > 0) {
            discountHtml += `
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">Giảm 5% (Đơn > 2tr):</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">-${formatPrice(calcAutoDiscount)}</td>
              </tr>
            `;
          }
          if (calcPromoDiscount > 0) {
            discountHtml += `
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">Mã giảm giá (${validatedCode}):</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">-${formatPrice(calcPromoDiscount)}</td>
              </tr>
            `;
          }
        }

        // [S6 FIX] Use env var for notification email
        const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'anhdt.hust@gmail.com';

        const htmlContent = `
          <h2>Đơn Đặt Hàng Mới Từ Bia Thầy Tu</h2>
          <p><strong>Mã Đơn Hàng:</strong> ${orderNumber}</p>
          <p><strong>Khách hàng:</strong> ${customer.name}</p>
          <p><strong>Số điện thoại:</strong> ${customer.phone}</p>
          <p><strong>Email:</strong> ${customer.email || 'Không có'}</p>
          <p><strong>Địa chỉ:</strong> ${customer.address}</p>
          <p><strong>Ghi chú:</strong> ${customer.note || 'Không có'}</p>
          
          <h3>Chi tiết đơn hàng:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Số lượng</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Đơn giá</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              ${discountHtml}
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Tổng thanh toán:</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #d32f2f;">${formatPrice(calcTotalPrice)}</td>
              </tr>
            </tfoot>
          </table>
          <p><a href="${process.env.AMC_DASHBOARD_URL || 'https://amc.biathaytu.com'}/orders">Vào trang Quản Lý Đơn Hàng</a></p>
        `;

        await transporter.sendMail({
          from: `"Bia Thầy Tu" <${process.env.SMTP_USER}>`,
          to: notificationEmail,
          subject: `[Đơn Hàng Mới] ${orderNumber} - Từ ${customer.name}`,
          html: htmlContent,
        });

        emailSent = true;
      } else {
        console.warn("SMTP credentials missing. Order saved to DB but email skipped.");
      }
    } catch (emailErr) {
      console.error("Failed to send order email:", emailErr);
    }

    if (emailSent) {
      await (supabase as ReturnType<typeof createAdminSupabase>)
        .from('orders' as never)
        .update({ email_sent: true } as never)
        .eq('id' as never, orderId as never);
    }

    // 8. Return Success
    return NextResponse.json({ 
      success: true, 
      orderNumber,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    console.error('Order API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
