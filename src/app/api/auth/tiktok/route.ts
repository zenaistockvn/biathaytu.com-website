import { NextResponse } from 'next/server';
import { TikTokProvider } from '@/lib/providers';

/**
 * GET /api/auth/tiktok
 * Redirects user to TikTok Login Kit.
 */
export async function GET() {
  const provider = new TikTokProvider();
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;
  const state = crypto.randomUUID();

  const authUrl = provider.getAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
