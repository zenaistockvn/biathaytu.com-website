import { NextResponse } from 'next/server';
import { getActivePromoByCode } from '@/lib/data/promo';

/**
 * POST /api/promo/validate — validate mã giảm giá server-side.
 */
export async function POST(req: Request) {
  try {
    const { code, subTotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không hợp lệ' });
    }

    const promo = getActivePromoByCode(code);
    if (!promo) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }

    const now = new Date();
    const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
    const minOrderValue = promo.min_order_value || 0;

    if (expiresAt && now > expiresAt) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá đã hết hạn sử dụng' });
    }

    if (typeof subTotal === 'number' && subTotal < minOrderValue) {
      return NextResponse.json({
        valid: false,
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(minOrderValue)}₫`,
      });
    }

    let discountAmount = 0;
    let label = '';
    if (promo.discount_type === 'percent') {
      if (typeof subTotal === 'number') discountAmount = subTotal * (promo.discount_value / 100);
      label = `Giảm ${promo.discount_value}%`;
    } else {
      discountAmount = promo.discount_value;
      label = `Giảm ${new Intl.NumberFormat('vi-VN').format(promo.discount_value)}₫`;
    }

    return NextResponse.json({
      valid: true,
      code: promo.code.toUpperCase(),
      label,
      discountAmount,
    });
  } catch {
    return NextResponse.json({ valid: false, message: 'Lỗi server' }, { status: 500 });
  }
}
