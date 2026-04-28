/**
 * API Authentication & Authorization middleware
 *
 * Uses Supabase Auth to validate user sessions.
 * Extracts tenant_id from authenticated user's metadata or defaults.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { DEFAULT_TENANT_ID } from '@/constants';

interface AuthContext {
  tenantId: string;
  userId: string;
}

/**
 * Validate API request and extract tenant context from Supabase Auth session.
 *
 * 1. Creates a Supabase client from request cookies
 * 2. Calls getUser() to verify the JWT
 * 3. Returns tenant context if authenticated
 * 4. Returns null if not authenticated
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // API routes don't need to set cookies
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Extract tenant_id from user metadata or default
  const tenantId = (user.user_metadata?.tenant_id as string) || DEFAULT_TENANT_ID;

  return {
    tenantId,
    userId: user.id,
  };
}

/**
 * Helper to require auth — returns 401 response or AuthContext.
 * Use this in API routes that require authentication.
 */
export async function requireAuth(request: NextRequest): Promise<AuthContext | NextResponse> {
  const ctx = await getAuthContext(request);
  if (!ctx) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return ctx;
}

/**
 * Verify cron secret for scheduled jobs.
 * Returns null if authorized, or a NextResponse error if not.
 */
export function verifyCronAuth(request: Request): NextResponse | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Generate a CSRF state token for OAuth flows.
 * In production, store in server-side session and validate on callback.
 */
export function generateOAuthState(tenantId: string): string {
  const timestamp = Date.now();
  const payload = `${tenantId}:${timestamp}`;
  return Buffer.from(payload).toString('base64url');
}

/**
 * Parse and validate OAuth state token.
 * Returns tenantId if valid, null if invalid.
 */
export function parseOAuthState(state: string): string | null {
  try {
    const decoded = Buffer.from(state, 'base64url').toString();

    const colonIdx = decoded.lastIndexOf(':');
    if (colonIdx === -1) return null;

    const tenantId = decoded.slice(0, colonIdx);
    const timestampStr = decoded.slice(colonIdx + 1);
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) return null;

    // State expires after 10 minutes
    const TEN_MINUTES = 10 * 60 * 1000;
    if (Date.now() - timestamp > TEN_MINUTES) {
      return null;
    }

    return tenantId || null;
  } catch {
    return null;
  }
}
