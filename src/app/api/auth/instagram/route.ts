import { NextResponse } from 'next/server';
import { InstagramProvider } from '@/lib/providers';

/**
 * GET /api/auth/instagram
 * Redirects user to Meta OAuth dialog with Instagram-specific scopes.
 * Uses the same Facebook App credentials (Meta unified platform).
 */
export async function GET() {
  const provider = new InstagramProvider();
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`;
  const state = crypto.randomUUID();

  const authUrl = provider.getAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
