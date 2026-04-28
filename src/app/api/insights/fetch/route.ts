import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { verifyCronAuth } from '@/lib/auth';
import { getPostInsights } from '@/lib/facebook';
import { decryptToken } from '@/lib/crypto';

/**
 * POST /api/insights/fetch
 * Fetch insights from Facebook for all published posts.
 * Called by Vercel Cron every 6 hours.
 */
export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const supabase = createAdminSupabase();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, external_id, platform, tenant_id')
    .eq('status', 'published')
    .not('external_id', 'is', null);

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: 'No published posts to fetch insights for', count: 0 });
  }

  const report: Array<{ post_id: string; status: string }> = [];

  for (const post of posts) {
    try {
      const { data: account } = await supabase
        .from('social_accounts')
        .select('access_token')
        .eq('tenant_id', post.tenant_id)
        .eq('platform', post.platform)
        .eq('is_active', true)
        .single();

      if (!account) {
        report.push({ post_id: post.id, status: 'no_account' });
        continue;
      }

      if (post.platform === 'facebook') {
        const insights = await getPostInsights(
          post.external_id!,
          decryptToken(account.access_token),
        );

        const totalEngagement =
          insights.reactions + insights.comments + insights.shares;
        const engagementRate =
          insights.reach > 0
            ? (totalEngagement / insights.reach) * 100
            : 0;

        await supabase.from('post_analytics').upsert(
          {
            post_id: post.id,
            likes: insights.reactions,
            comments: insights.comments,
            shares: insights.shares,
            reach: insights.reach,
            engagement: Math.round(engagementRate * 100) / 100,
            fetched_at: new Date().toISOString(),
          },
          { onConflict: 'post_id' },
        );

        report.push({ post_id: post.id, status: 'ok' });
      } else {
        report.push({ post_id: post.id, status: 'platform_not_supported' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Insights fetch error for post ${post.id}:`, message);
      report.push({ post_id: post.id, status: message });
    }
  }

  return NextResponse.json({
    message: 'Insights fetch complete',
    timestamp: new Date().toISOString(),
    total: posts.length,
    report,
  });
}
