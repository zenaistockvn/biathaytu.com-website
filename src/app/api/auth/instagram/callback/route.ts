import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { InstagramProvider, FacebookProvider } from '@/lib/providers';
import { encryptToken } from '@/lib/crypto';

const TENANT_ID = 'demo-tenant';

/**
 * GET /api/auth/instagram/callback
 * Handles Meta OAuth callback for Instagram.
 * Flow: exchange code → get FB Pages → find linked IG Business Account → save to DB.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(error || 'No code received')}`,
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`;
    const igProvider = new InstagramProvider();
    const fbProvider = new FacebookProvider();

    // Exchange code for token (using IG scopes via Meta OAuth)
    const tokens = await igProvider.exchangeCode(code, redirectUri);

    // Get Facebook Pages → find linked Instagram Business Account
    const pages = await fbProvider.getUserPages(tokens.accessToken);
    const supabase = createAdminSupabase();
    let connectedCount = 0;

    for (const page of pages) {
      const igAccountId = await igProvider.getInstagramAccountId(
        page.accessToken,
        page.id,
      );
      if (!igAccountId) continue;

      // Upsert social account for Instagram
      const { error: upsertError } = await supabase
        .from('social_accounts')
        .upsert(
          {
            tenant_id: TENANT_ID,
            platform: 'instagram',
            account_id: igAccountId,
            account_name: `IG — ${page.name}`,
            access_token: encryptToken(page.accessToken), // Encrypted before storage
            is_active: true,
            token_expiry: new Date(
              Date.now() + 60 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 60 days
          },
          { onConflict: 'tenant_id,platform,account_id' },
        );

      if (!upsertError) connectedCount++;
    }

    if (connectedCount === 0) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(
          'Không tìm thấy Instagram Business Account. Hãy đảm bảo Facebook Page đã liên kết với Instagram Business.',
        )}`,
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?success=instagram&pages=${connectedCount}`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Instagram OAuth callback error:', message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(message)}`,
    );
  }
}
