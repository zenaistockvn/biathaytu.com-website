import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import type { CreatePostPayload } from '@/types';

/** GET /api/posts — Lấy danh sách posts */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select('*, products(name)')
    .eq('tenant_id', tenantId)
    .order('scheduled_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/posts — Tạo post mới (từ Content Library hoặc manual) */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body: CreatePostPayload = await request.json();

  const {
    contentId,
    productId,
    platforms,
    caption,
    hashtags,
    imageUrls,
    scheduledAt,
    publishNow,
  } = body;

  if (!caption || !platforms || !platforms.length) {
    return NextResponse.json(
      { error: 'caption and platforms array are required' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();

  // Determine scheduled time
  const scheduleTime = publishNow
    ? new Date().toISOString()
    : scheduledAt ?? new Date().toISOString();

  // Create posts for each platform
  const insertData = platforms.map(platform => ({
    product_id: productId || null,
    platform,
    caption: hashtags ? `${caption}\n\n${hashtags}` : caption,
    image_urls: imageUrls ?? [],
    scheduled_at: scheduleTime,
    is_approved: publishNow ? true : false,
    status: publishNow ? 'scheduled' : 'pending',
    tenant_id: tenantId,
    target_page_id: body.targetPageId ?? null,
  }));

  const { data: createdPosts, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select();

  if (error || !createdPosts) {
    return NextResponse.json({ error: error?.message || 'Failed to create posts' }, { status: 500 });
  }

  // If publishing now, also mark the content as published
  if (contentId) {
    await supabase
      .from('generated_contents')
      .update({ status: publishNow ? 'published' : 'approved' })
      .eq('id', contentId);
  }

  // If publishNow, trigger publish immediately for ALL created posts
  if (publishNow) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cookieHeader = request.headers.get('cookie') || '';
    
    // We do them concurrently
    const publishPromises = createdPosts.map(async (post) => {
      try {
        const publishRes = await fetch(`${baseUrl}/api/publish`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cookie': cookieHeader
          },
          body: JSON.stringify({ postId: post.id }),
        });
        const publishData = await publishRes.json();
        return {
          platform: post.platform,
          success: publishRes.ok,
          message: publishData.message || null,
          external_id: publishData.external_id || null,
          error: publishRes.ok ? null : publishData.error,
        };
      } catch (err: unknown) {
        return {
          platform: post.platform,
          success: false,
          error: err instanceof Error ? err.message : 'Publish failed',
        };
      }
    });

    const publishResults = await Promise.all(publishPromises);
    const anyFailed = publishResults.some(r => !r.success);

    return NextResponse.json({
      posts: createdPosts,
      published: !anyFailed,
      results: publishResults,
    }, { status: 201 });
  }

  return NextResponse.json({ posts: createdPosts }, { status: 201 });
}
