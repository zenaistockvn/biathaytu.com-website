import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { getProvider, isPlatformSupported } from '@/lib/providers';
import { decryptToken } from '@/lib/crypto';

/**
 * GET /api/inbox?platform=facebook&since=2024-01-01T00:00:00Z
 * Fetches inbox messages (DMs) from connected social accounts via Provider.
 */
export async function GET(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get('platform') || 'facebook';
  const tenantId = request.nextUrl.searchParams.get('tenantId') || 'demo-tenant';
  const sinceParam = request.nextUrl.searchParams.get('since');
  const since = sinceParam ? new Date(sinceParam) : undefined;

  if (!isPlatformSupported(platform)) {
    return NextResponse.json(
      { error: `Platform ${platform} not supported` },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();
  const { data: accounts } = await supabase
    .from('social_accounts')
    .select('account_id, access_token')
    .eq('tenant_id', tenantId)
    .eq('platform', platform)
    .eq('is_active', true);

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ messages: [], count: 0 });
  }

  const provider = getProvider(platform);
  const allMessages = [];

  for (const account of accounts) {
    try {
      const messages = await provider.getMessages(decryptToken(account.access_token), since);
      allMessages.push(...messages);
    } catch (err) {
      console.error(`Inbox fetch error for ${account.account_id}:`, err);
      // Continue fetching from other accounts
    }
  }

  // Sort by timestamp desc (newest first)
  allMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return NextResponse.json({
    messages: allMessages,
    count: allMessages.length,
  });
}
