import { NextResponse } from 'next/server';
import { LinkedInProvider } from '@/lib/providers';

/**
 * GET /api/auth/linkedin
 * Redirects user to LinkedIn OAuth Setup.
 */
export async function GET() {
  const provider = new LinkedInProvider();
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`;
  const state = crypto.randomUUID();

  const authUrl = provider.getAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
