import { NextResponse } from 'next/server';
import { getOAuthUrl } from '@/lib/facebook';
import { generateOAuthState } from '@/lib/auth';
import { DEFAULT_TENANT_ID } from '@/constants';

/**
 * GET /api/auth/facebook
 * Redirects user to Facebook OAuth dialog
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/facebook/callback`;
  const state = generateOAuthState(DEFAULT_TENANT_ID);

  const oauthUrl = getOAuthUrl(redirectUri, state);
  return NextResponse.redirect(oauthUrl);
}
