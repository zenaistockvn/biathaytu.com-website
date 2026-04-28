import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { analyzeProductImage } from '@/lib/ai/gemini';

/** POST /api/ai/analyze — Phân tích ảnh sản phẩm bằng Gemini Vision */
export async function POST(request: Request) {
  const body = await request.json();
  const { imageBase64, productId } = body;

  if (!imageBase64) {
    return NextResponse.json({ error: 'imageBase64 is required' }, { status: 400 });
  }

  // Phân tích ảnh
  const analysis = await analyzeProductImage(imageBase64);

  // Nếu có productId, cập nhật vào DB
  if (productId) {
    const supabase = createAdminSupabase();
    await supabase
      .from('products')
      .update({ ai_analysis: analysis })
      .eq('id', productId);
  }

  return NextResponse.json(analysis);
}
