import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';
import { generateOAuthState } from '@/lib/auth';
import { DEFAULT_TENANT_ID } from '@/constants';
import { YouTubeProvider } from '@/lib/providers/youtube';

/**
 * GET /api/auth/youtube
 * Redirects user to Google OAuth consent screen for YouTube
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;
  const state = generateOAuthState(DEFAULT_TENANT_ID);

  const provider = new YouTubeProvider({
    clientId: process.env.YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    redirectUri,
  });

  const oauthUrl = provider.getAuthUrl(redirectUri, state);
  return NextResponse.redirect(oauthUrl);
}
