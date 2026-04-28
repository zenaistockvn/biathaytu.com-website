import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

/** GET /api/reference-assets — Get list of reference assets */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  const supabase = createAdminSupabase();
  let query = supabase
    .from('reference_assets')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/reference-assets — Create a reference asset */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();

  if (!body.product_id || !body.asset_type || !body.image_url) {
    return NextResponse.json({ error: 'product_id, asset_type, and image_url are required' }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('reference_assets')
    .insert({
      product_id: body.product_id,
      asset_type: body.asset_type,
      image_url: body.image_url,
      description: body.description || null,
      is_transparent_bg: body.is_transparent_bg ?? true,
      tenant_id: tenantId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
