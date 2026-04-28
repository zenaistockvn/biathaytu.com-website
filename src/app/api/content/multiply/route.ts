import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { multiplyContent, reviewContentAI } from '@/lib/ai/deepseek';

/** POST /api/content/multiply — 1 bài gốc → 4-6 phiên bản đa kênh (DeepSeek) */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();
  const { contentId, targetPlatforms, originalCaption, productName } = body;

  if (!originalCaption || !targetPlatforms?.length) {
    return NextResponse.json(
      { error: 'originalCaption and targetPlatforms are required' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();

  const { data: brand } = await supabase
    .from('brand_settings')
    .select('brand_voice')
    .eq('tenant_id', tenantId)
    .single();

  const brandVoice = brand?.brand_voice ?? '';

  const result = await multiplyContent(
    originalCaption,
    targetPlatforms,
    brandVoice,
    productName ?? '',
  );

  const variants = [];
  for (const variant of result.variants ?? []) {
    const review = await reviewContentAI(variant.caption);

    const { data: saved } = await supabase
      .from('generated_contents')
      .insert({
        product_id: body.productId ?? null,
        platform: variant.platform,
        caption: variant.caption,
        hashtags: JSON.stringify(variant.hashtags ?? []),
        image_urls: [],
        ai_score: review.score,
        status: review.approved ? 'approved' : 'needs_review',
        parent_id: contentId ?? null,
        content_format: 'social_post',
        tenant_id: tenantId,
      })
      .select()
      .single();

    variants.push({ ...saved, review });
  }

  return NextResponse.json({ variants, count: variants.length });
}
