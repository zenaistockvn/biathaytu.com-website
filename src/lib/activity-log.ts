/**
 * Activity Logging Service
 * Ghi nhận mọi hoạt động quan trọng của user vào bảng activity_logs.
 * Sử dụng admin client (bypass RLS) để đảm bảo luôn ghi được.
 */

import { createAdminSupabase } from '@/lib/supabase/server';
import type { Json } from '@/types/database';

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'create_content'
  | 'edit_content'
  | 'delete_content'
  | 'schedule_post'
  | 'approve_post'
  | 'publish_post'
  | 'connect_account'
  | 'disconnect_account'
  | 'update_rule'
  | 'create_article'
  | 'view_page';

interface LogActivityParams {
  userId: string;
  tenantId?: string;
  action: ActivityAction;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  request?: Request;
}

/**
 * Ghi log hoạt động vào database.
 * Non-blocking — errors are logged but don't throw.
 */
export async function logActivity({
  userId,
  tenantId = 'demo-tenant',
  action,
  entityType,
  entityId,
  metadata = {},
  request,
}: LogActivityParams): Promise<void> {
  try {
    const supabase = createAdminSupabase();

    const ipAddress = request
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
      : null;

    const userAgent = request
      ? request.headers.get('user-agent')?.slice(0, 500)
      : null;

    await supabase.from('activity_logs').insert({
      user_id: userId,
      tenant_id: tenantId,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata: metadata as unknown as Json,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (err) {
    // Non-blocking: log error but don't crash the request
    console.error('[ActivityLog] Failed to log activity:', err);
  }
}

/**
 * Helper: extract user info from Supabase auth in API routes
 */
export async function getUserFromRequest(request: Request): Promise<{
  userId: string;
  email: string;
  tenantId: string;
} | null> {
  try {
    // We use admin client to verify, but typically you'd use the server client
    // For API routes, we extract from the auth header or cookie
    const { createServerSupabase } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get tenant from public.users
    const adminSupabase = createAdminSupabase();
    const { data: dbUser } = await adminSupabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    return {
      userId: user.id,
      email: user.email ?? '',
      tenantId: dbUser?.tenant_id ?? 'demo-tenant',
    };
  } catch {
    return null;
  }
}
