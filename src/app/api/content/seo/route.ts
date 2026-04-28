import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { generateSEOArticle } from '@/lib/ai/deepseek';

/** POST /api/content/seo — AI viết bài SEO dài (DeepSeek) */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();
  const { productId, productInfo, topic, keywords = [] } = body;

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Build product info from DB if productId provided, or use free-text productInfo
  let info = productInfo || '';
  if (productId && !info) {
    const { data: product } = await supabase
      .from('products')
      .select('name, description, category, usp')
      .eq('id', productId)
      .single();
    if (product) {
      info = `${product.name} — ${product.category || ''}. ${product.description || ''} USP: ${product.usp || ''}`;
    }
  }

  const article = await generateSEOArticle(info || 'Sản phẩm', topic, keywords);

  const { data: saved, error } = await supabase
    .from('seo_articles')
    .insert({
      product_id: productId || null,
      title: article.title,
      slug: article.slug,
      content: article.content,
      meta_description: article.meta_description,
      keywords,
      word_count: article.word_count ?? 0,
      status: 'draft',
      tenant_id: tenantId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ article: saved });
}

/** GET /api/content/seo — Lấy danh sách bài SEO */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('seo_articles')
    .select('*, products(name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data });
}
