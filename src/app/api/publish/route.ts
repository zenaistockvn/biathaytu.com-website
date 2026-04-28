import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { getProvider, isPlatformSupported } from '@/lib/providers';
import { decryptToken } from '@/lib/crypto';
import { resolvePublishAccount, toAbsoluteImageUrls, detectPostType } from '@/lib/publishing';

/**
 * POST /api/publish
 * Publishes a post to connected social platform via Provider pattern.
 * Supports: Facebook, Instagram (and any future platform registered in providers/index.ts)
 * Body: { postId: string }
 */
export async function POST(request: NextRequest) {
  const { postId } = await request.json();

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();

  // Fetch the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (post.status === 'published') {
    return NextResponse.json(
      { error: 'Post already published' },
      { status: 400 },
    );
  }

  // Check platform support
  if (!isPlatformSupported(post.platform)) {
    return NextResponse.json(
      { error: `${post.platform} publishing not yet supported` },
      { status: 400 },
    );
  }

  // Resolve target social account (shared logic)
  const account = await resolvePublishAccount(
    supabase, post.tenant_id, post.platform, post.target_page_id,
  );

  if (!account) {
    return NextResponse.json(
      {
        error: `No connected ${post.platform} account. Please connect your account first.`,
      },
      { status: 400 },
    );
  }

  try {
    const provider = getProvider(post.platform);
    const absoluteImageUrls = toAbsoluteImageUrls(post.image_urls as string[]);
    const postType = detectPostType(absoluteImageUrls);

    const providerResult = await provider.publishPost(decryptToken(account.access_token), {
      text: post.caption,
      mediaUrls: absoluteImageUrls,
      postType,
      extra: {
        pageId: account.account_id,
        igAccountId: account.account_id,
        platform: post.platform,
      },
    });

    // Update post status
    await supabase
      .from('posts')
      .update({
        status: 'published',
        external_id: providerResult.platformPostId,
        published_at: new Date().toISOString(),
        error_log: null,
      })
      .eq('id', postId);

    return NextResponse.json({
      success: true,
      external_id: providerResult.platformPostId,
      url: providerResult.url,
      message: 'Post published successfully!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown publish error';
    console.error('Publish error:', message);

    // Save error to DB
    await supabase
      .from('posts')
      .update({
        status: 'failed',
        error_log: message,
      })
      .eq('id', postId);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
