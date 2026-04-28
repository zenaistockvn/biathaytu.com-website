import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { verifyCronAuth } from '@/lib/auth';
import { getProvider, isPlatformSupported } from '@/lib/providers';
import { decryptToken } from '@/lib/crypto';
import { resolvePublishAccount, toAbsoluteImageUrls, detectPostType } from '@/lib/publishing';

/**
 * POST /api/cron/auto-publisher
 * Vercel Cron — chạy mỗi giờ.
 * Tìm posts có status='scheduled' + scheduled_at <= now → publish via Provider pattern.
 * Supports: Facebook, Instagram (and any future platform registered in providers/index.ts)
 */
export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const supabase = createAdminSupabase();
  const now = new Date().toISOString();

  const { data: duePosts, error: queryError } = await supabase
    .from('posts')
    .select('id, platform, caption, image_urls, tenant_id, target_page_id')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true });

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({
      message: 'No posts due for publishing',
      timestamp: now,
      published: 0,
    });
  }

  const report: Array<{ post_id: string; status: string; external_id?: string }> = [];

  for (const post of duePosts) {
    try {
      // Check platform support
      if (!isPlatformSupported(post.platform)) {
        report.push({ post_id: post.id, status: `${post.platform}_not_supported` });
        continue;
      }

      // Resolve target social account (shared logic)
      const account = await resolvePublishAccount(
        supabase, post.tenant_id, post.platform, post.target_page_id,
      );

      if (!account) {
        await supabase.from('posts').update({
          status: 'needs_review',
          error_log: `No connected ${post.platform} account`,
        }).eq('id', post.id);

        report.push({ post_id: post.id, status: 'no_account' });
        continue;
      }

      // Publish via provider pattern
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
        },
      });

      await supabase.from('posts').update({
        status: 'published',
        external_id: providerResult.platformPostId,
        published_at: new Date().toISOString(),
        error_log: null,
      }).eq('id', post.id);

      report.push({
        post_id: post.id,
        status: 'published',
        external_id: providerResult.platformPostId,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Publish failed';
      console.error(`Auto-publish failed for post ${post.id}:`, message);

      const { data: currentPost } = await supabase
        .from('posts')
        .select('error_log')
        .eq('id', post.id)
        .single();

      const hadPreviousError = currentPost?.error_log;

      await supabase.from('posts').update({
        status: hadPreviousError ? 'failed' : 'scheduled',
        error_log: message,
      }).eq('id', post.id);

      report.push({
        post_id: post.id,
        status: hadPreviousError ? 'failed' : 'will_retry',
      });
    }
  }

  const published = report.filter(r => r.status === 'published').length;
  const failed = report.filter(r => r.status === 'failed').length;

  return NextResponse.json({
    message: `Auto-publisher complete: ${published} published, ${failed} failed`,
    timestamp: now,
    total: duePosts.length,
    published,
    failed,
    report,
  });
}
