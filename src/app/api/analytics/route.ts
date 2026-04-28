import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { getProvider, type SupportedPlatform } from '@/lib/providers';
import { decryptToken } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const platform = searchParams.get('platform');
    const accountId = searchParams.get('accountId');

    if (!tenantId || !platform || !accountId) {
      return NextResponse.json(
        { error: 'Missing required parameters: tenantId, platform, accountId' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabase();

    // 1. Fetch access token from DB
    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('access_token')
      .eq('tenant_id', tenantId)
      .eq('platform', platform)
      .eq('account_id', accountId)
      .eq('is_active', true)
      .single();

    if (accountError || !account?.access_token) {
      return NextResponse.json(
        { error: 'Account not configured or inactive' },
        { status: 404 }
      );
    }

    // 2. Fetch metrics
    const provider = getProvider(platform as SupportedPlatform);
    
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const metrics = await provider.getAccountMetrics(decryptToken(account.access_token), {
      since: thirtyDaysAgo,
      until: now,
    });

    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error(`[Analytics API] Error:`, error);
    
    // Provide a mocked fallback if the provider does not support it or errors out 
    // (useful for LinkedIn/TikTok MVPs where advanced analytics access might be restricted)
    return NextResponse.json(
      { 
        error: error.message || 'Error fetching analytics',
        fallback: {
          followers: 0,
          followersGained: 0,
          impressions: 0,
          reach: 0,
          profileViews: 0,
          extra: { mock: true, reason: error.message }
        }
      },
      { status: 200 } // Returning 200 with error + fallback so the UI can gracefully downgrade
    );
  }
}
