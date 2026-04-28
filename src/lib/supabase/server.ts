import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase client with cookie-based auth.
 * Use in Server Components and Server Actions.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component — ignore set errors
          }
        },
      },
    },
  );
}

/**
 * Admin client with service role key — bypasses RLS.
 * Use ONLY in API routes and cron jobs, never in client code.
 * 
 * Singleton pattern: reuses the same client instance across requests.
 */
let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminSupabase() {
  if (!adminClient) {
    adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key',
    );
  }
  return adminClient;
}
