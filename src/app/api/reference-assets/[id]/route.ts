import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

/** DELETE /api/reference-assets/[id] — Delete a reference asset */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from('reference_assets')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

/** PATCH /api/reference-assets/[id] — Update a reference asset */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('reference_assets')
    .update({
      asset_type: body.asset_type,
      image_url: body.image_url,
      description: body.description,
      is_transparent_bg: body.is_transparent_bg,
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
