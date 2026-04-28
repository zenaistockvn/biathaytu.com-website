import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { exchangeCodeForToken, getUserPages } from '@/lib/facebook';
import { parseOAuthState } from '@/lib/auth';
import { DEFAULT_TENANT_ID } from '@/constants';
import { encryptToken } from '@/lib/crypto';

/**
 * GET /api/auth/facebook/callback
 * Facebook redirects here after user authorizes.
 * Exchanges code → token → saves Page info to social_accounts
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state') ?? '';

  // Validate CSRF state
  const tenantId = parseOAuthState(state) ?? DEFAULT_TENANT_ID;

  // User denied permission
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
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    // Exchange code → long-lived user token
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Get user's Pages
    const pages = await getUserPages(tokenData.access_token);

    if (pages.length === 0) {
      return NextResponse.redirect(
        new URL('/amc/accounts?error=no_pages', request.url),
      );
    }

    const supabase = createAdminSupabase();

    // Save each Page as a social account
    for (const page of pages) {
      const tokenExpiry = new Date();
      tokenExpiry.setDate(tokenExpiry.getDate() + 60);

      await supabase.from('social_accounts').upsert(
        {
          platform: 'facebook',
          account_name: page.name,
          account_id: page.id,
          access_token: encryptToken(page.access_token),
          token_expiry: tokenExpiry.toISOString(),
          is_active: true,
          tenant_id: tenantId,
        },
        { onConflict: 'account_id' },
      );
    }

    return NextResponse.redirect(
      new URL(`/amc/accounts?success=facebook&pages=${pages.length}`, request.url),
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Facebook OAuth callback error:', message);
    return NextResponse.redirect(
      new URL(
        `/amc/accounts?error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }
}
