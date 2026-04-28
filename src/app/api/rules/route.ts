import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

/** GET /api/rules — Lấy danh sách rules */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('schedule_rules')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/rules — Tạo rule mới */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();

  if (!body.name || !body.time || !body.platform) {
    return NextResponse.json(
      { error: 'name, time, and platform are required' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('schedule_rules')
    .insert({
      name: body.name,
      time: body.time,
      platform: body.platform,
      content_type: body.contentType,
      days_of_week: body.daysOfWeek ?? [1, 2, 3, 4, 5],
      rotation: body.rotation ?? 'round_robin',
      is_active: true,
      tenant_id: tenantId,
      target_page_id: body.targetPageId ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
