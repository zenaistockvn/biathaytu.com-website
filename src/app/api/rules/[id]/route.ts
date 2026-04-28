import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

const ALLOWED_PATCH_FIELDS = ['name', 'time', 'platform', 'content_type', 'days_of_week', 'rotation', 'is_active'];

/** PATCH /api/rules/[id] — Cập nhật rule (có validation + tenant check) */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();

  // Whitelist fields — chỉ cho update các field hợp lệ
  const sanitized: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (ALLOWED_PATCH_FIELDS.includes(key)) {
      sanitized[key] = body[key];
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  // Tenant-scoped update — chỉ sửa rule thuộc tenant của mình
  const { data, error } = await supabase
    .from('schedule_rules')
    .update(sanitized)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Rule not found or access denied' }, { status: 404 });
  return NextResponse.json(data);
}

/** DELETE /api/rules/[id] — Xoá rule (tenant-scoped) */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const supabase = createAdminSupabase();

  const { error, count } = await supabase
    .from('schedule_rules')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (count === 0) return NextResponse.json({ error: 'Rule not found or access denied' }, { status: 404 });
  return NextResponse.json({ success: true });
}
