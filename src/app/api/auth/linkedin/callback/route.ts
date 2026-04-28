import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { LinkedInProvider } from '@/lib/providers';
import { encryptToken } from '@/lib/crypto';

const TENANT_ID = 'demo-tenant';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');
  const errorDescription = request.nextUrl.searchParams.get('error_description');

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(errorDescription || error || 'No code received')}`,
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`;
    const provider = new LinkedInProvider();

    const tokens = await provider.exchangeCode(code, redirectUri);
    const profile = await provider.getProfile(tokens.accessToken);
    const displayName = profile.name;

    const supabase = createAdminSupabase();
    
    // Upsert social account for LinkedIn
    const { error: upsertError } = await supabase
      .from('social_accounts')
      .upsert(
        {
          tenant_id: TENANT_ID,
          platform: 'linkedin',
          account_id: profile.platformId, // LinkedIn Member URN ID
          account_name: displayName,
          access_token: encryptToken(tokens.accessToken),
          is_active: true,
          token_expiry: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
        },
        { onConflict: 'tenant_id,platform,account_id' },
      );

    if (upsertError) throw upsertError;

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?success=linkedin&pages=1`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('LinkedIn OAuth callback error:', message);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/amc/accounts?error=${encodeURIComponent(message)}`,
    );
  }
}
