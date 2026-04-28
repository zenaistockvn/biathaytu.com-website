import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { parseOAuthState } from '@/lib/auth';
import { DEFAULT_TENANT_ID } from '@/constants';
import { encryptToken } from '@/lib/crypto';
import { YouTubeProvider } from '@/lib/providers/youtube';

/**
 * GET /api/auth/youtube/callback
 * Google redirects here after user authorizes YouTube scopes.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state') ?? '';

  const tenantId = parseOAuthState(state) ?? DEFAULT_TENANT_ID;

  if (error) {
    return NextResponse.redirect(
      new URL('/amc/accounts?error=denied', request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/amc/accounts?error=no_code', request.url),
    );
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

    const provider = new YouTubeProvider({
      clientId: process.env.YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
      redirectUri,
    });

    const tokenData = await provider.exchangeCode(code, redirectUri);
    const profile = await provider.getProfile(tokenData.accessToken);

    const supabase = createAdminSupabase();

    const tokenExpiry = tokenData.expiresIn 
      ? new Date(Date.now() + tokenData.expiresIn * 1000)
      : new Date(Date.now() + 3600 * 1000); // default 1 hour if unspecified

    await supabase.from('social_accounts').upsert(
      {
        platform: 'youtube',
        account_name: profile.name,
        account_id: profile.platformId,
        access_token: encryptToken(tokenData.accessToken),
        refresh_token: tokenData.refreshToken ? encryptToken(tokenData.refreshToken) : null,
        token_expiry: tokenExpiry.toISOString(),
        is_active: true,
        tenant_id: tenantId,
      },
      { onConflict: 'account_id' },
    );

    return NextResponse.redirect(
      new URL(`/amc/accounts?success=youtube&account=${encodeURIComponent(profile.name)}`, request.url),
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('YouTube OAuth callback error:', message);
    return NextResponse.redirect(
      new URL(
        `/amc/accounts?error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }
}
