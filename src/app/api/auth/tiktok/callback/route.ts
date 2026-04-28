import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { TikTokProvider } from '@/lib/providers';
import { encryptToken } from '@/lib/crypto';

const TENANT_ID = 'demo-tenant';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(error || 'No code received')}`,
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;
    const provider = new TikTokProvider();

    const tokens = await provider.exchangeCode(code, redirectUri);
    const profile = await provider.getProfile(tokens.accessToken);

    const supabase = createAdminSupabase();
    
    // Upsert social account for TikTok
    const { error: upsertError } = await supabase
      .from('social_accounts')
      .upsert(
        {
          tenant_id: TENANT_ID,
          platform: 'tiktok',
          account_id: profile.platformId,
          account_name: `${profile.name} (@${profile.handle})`,
          access_token: encryptToken(tokens.accessToken),
          is_active: true,
          token_expiry: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
        },
        { onConflict: 'tenant_id,platform,account_id' },
      );

    if (upsertError) throw upsertError;

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?success=tiktok&pages=1`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('TikTok OAuth callback error:', message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(message)}`,
    );
  }
}
