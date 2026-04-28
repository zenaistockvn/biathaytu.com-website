import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

/** PATCH /api/content/bulk — Bulk update status for multiple content items */
export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const body = await request.json();
  const { ids, action } = body as {
    ids: string[];
    action: 'approve' | 'reject' | 'delete';
  };

  if (!ids?.length || !action) {
    return NextResponse.json(
      { error: 'ids (string[]) and action (approve|reject|delete) are required' },
      { status: 400 },
    );
  }

  if (ids.length > 100) {
    return NextResponse.json(
      { error: 'Maximum 100 items per batch' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();

  if (action === 'delete') {
    const { error } = await supabase
      .from('generated_contents')
      .delete()
      .in('id', ids)
      .eq('tenant_id', tenantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Đã xóa ${ids.length} content`, count: ids.length });
  }

  const statusMap = {
    approve: 'approved',
    reject: 'draft',
  };

  const newStatus = statusMap[action];

  const { data, error } = await supabase
    .from('generated_contents')
    .update({ status: newStatus })
    .in('id', ids)
    .eq('tenant_id', tenantId)
    .select('id, status');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Đã ${action === 'approve' ? 'duyệt' : 'từ chối'} ${data?.length} content`,
    count: data?.length,
    updated: data,
  });
}
