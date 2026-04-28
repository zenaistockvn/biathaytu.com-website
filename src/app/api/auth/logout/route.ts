import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity-log';

/**
 * POST /api/auth/logout
 * Sign out the current user and log the activity.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await logActivity({
        userId: user.id,
        action: 'logout',
        entityType: 'session',
        metadata: { email: user.email },
        request,
      });
    }

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
