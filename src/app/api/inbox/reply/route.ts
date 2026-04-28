import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { getProvider, type SupportedPlatform } from '@/lib/providers';
import { decryptToken } from '@/lib/crypto';

/**
 * POST /api/inbox/reply
 * Body: { tenantId, platform, platformId, conversationId, messageId, text }
 * Replies to an inbox message or comment
 */
export async function POST(request: NextRequest) {
  try {
    const { tenantId, platform, platformId, conversationId, messageId, text } = await request.json();

    if (!tenantId || !platform || !platformId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const targetId = conversationId || messageId; // usually conversationId for DMs, messageId for comments
    if (!targetId) {
        return NextResponse.json({ error: 'Missing conversationId or messageId to reply to' }, { status: 400 });
    }

    const supabase = createAdminSupabase();

    // 1. Fetch access token from DB
    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('access_token')
      .eq('tenant_id', tenantId)
      .eq('platform', platform)
      .eq('account_id', platformId)
      .eq('is_active', true)
      .single();

    if (accountError || !account?.access_token) {
      return NextResponse.json(
        { error: `Account not found or inactive for tenant ${tenantId} and platform ${platform}` },
        { status: 404 }
      );
    }

    // 2. Load provider and reply
    const provider = getProvider(platform as SupportedPlatform);
    const result = await provider.replyToMessage(decryptToken(account.access_token), targetId, text);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error(`[Inbox API Reply] Error:`, error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error', context: error.rawResponse },
      { status: 500 }
    );
  }
}
