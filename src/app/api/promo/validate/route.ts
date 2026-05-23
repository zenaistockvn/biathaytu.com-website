import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

/**
 * POST /api/promo/validate
 * Validate promo codes server-side — codes never exposed to client.
 */

// Query promo codes dynamically from Supabase public.promo_codes table
export async function POST(req: Request) {
  try {
    const { code, subTotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không hợp lệ' });
    }

    const normalizedCode = code.trim().toUpperCase();
    const supabase = createAdminSupabase();

    const { data: promoData, error: promoError } = await supabase
      .from('promo_codes' as never)
      .select('*' as never)
      .eq('code' as never, normalizedCode as never)
      .eq('is_active' as never, true as never)
      .single();

    if (promoError || !promoData) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }

    const promo = promoData as {
      discount_type: 'percent' | 'amount';
      discount_value: number;
      min_order_value?: number;
      expires_at?: string | null;
    };

    const now = new Date();
    const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
    const minOrderValue = promo.min_order_value || 0;

    if (expiresAt && now > expiresAt) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá đã hết hạn sử dụng' });
    }

    if (typeof subTotal === 'number' && subTotal < minOrderValue) {
      return NextResponse.json({ 
        valid: false, 
        message: `Mã này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(minOrderValue)}₫` 
      });
    }

    let discountAmount = 0;
    let label = '';

    if (promo.discount_type === 'percent') {
      if (typeof subTotal === 'number') {
        discountAmount = subTotal * (promo.discount_value / 100);
      }
      label = `Giảm ${promo.discount_value}%`;
    } else if (promo.discount_type === 'amount') {
      discountAmount = promo.discount_value;
      label = `Giảm ${new Intl.NumberFormat('vi-VN').format(promo.discount_value)}₫`;
    }

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      label,
      discountAmount,
    });
  } catch {
    return NextResponse.json({ valid: false, message: 'Lỗi server' }, { status: 500 });
  }
}
