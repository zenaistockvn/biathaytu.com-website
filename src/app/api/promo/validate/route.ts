import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

/**
 * POST /api/promo/validate
 * Validate promo codes server-side — codes never exposed to client.
 */

// Promo codes stored server-side only
const PROMO_CODES: Record<string, { percent?: number; amount?: number; label: string }> = {
  'VIP10': { percent: 10, label: 'Giảm 10% VIP' },
  'FREESHIP': { amount: 30000, label: 'Miễn phí vận chuyển 30,000₫' },
};

export async function POST(req: Request) {
  try {
    const { code, subTotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không hợp lệ' });
    }

    const normalizedCode = code.trim().toUpperCase();
    const promo = PROMO_CODES[normalizedCode];

    if (!promo) {
      return NextResponse.json({ valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    }

    let discountAmount = 0;
    if (promo.percent && typeof subTotal === 'number') {
      discountAmount = subTotal * (promo.percent / 100);
    } else if (promo.amount) {
      discountAmount = promo.amount;
    }

    return NextResponse.json({
      valid: true,
      code: normalizedCode,
      label: promo.label,
      discountAmount,
    });
  } catch {
    return NextResponse.json({ valid: false, message: 'Lỗi server' }, { status: 500 });
  }
}
