import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity-log';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * POST /api/auth/log
 * Ghi log login/logout activity.
 * Body: { action: 'login' | 'logout' }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action as string;

    if (!['login', 'logout', 'login_failed'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await logActivity({
      userId: user.id,
      action: action as 'login' | 'logout' | 'login_failed',
      entityType: 'session',
      metadata: {
        email: user.email,
        provider: 'email',
      },
      request,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
