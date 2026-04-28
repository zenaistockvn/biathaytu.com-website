import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { splitToMicroContent } from '@/lib/ai/deepseek';

/** POST /api/content/micro — Tách bài SEO thành micro-content (DeepSeek) */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();
  const { articleId } = body;

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  const { data: article, error: artErr } = await supabase
    .from('seo_articles')
    .select('*, products(name)')
    .eq('id', articleId)
    .single();

  if (artErr || !article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const result = await splitToMicroContent(article.title, article.content);

  const microContents = [];
  for (const mc of result.micro_contents ?? []) {
    const { data: saved } = await supabase
      .from('generated_contents')
      .insert({
        product_id: article.product_id,
        platform: 'instagram',
        caption: mc.content,
        hashtags: '[]',
        content_format: mc.format,
        source_article_id: articleId,
        status: 'draft',
        tenant_id: tenantId,
      })
      .select()
      .single();

    microContents.push({ ...saved, format: mc.format, slide_number: mc.slide_number });
  }

  await supabase
    .from('seo_articles')
    .update({ micro_content_count: microContents.length })
    .eq('id', articleId);

  return NextResponse.json({
    micro_contents: microContents,
    count: microContents.length,
  });
}
