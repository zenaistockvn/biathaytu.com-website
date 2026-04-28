import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

/** PATCH /api/satellite-pages/[id] — Update a satellite page */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const { id } = await params;
  const body = await request.json();

  const supabase = createAdminSupabase();

  // Build update object from provided fields
  const updates: Record<string, unknown> = {};
  if (body.pageName !== undefined) updates.page_name = body.pageName;
  if (body.pageSlug !== undefined) updates.page_slug = body.pageSlug;
  if (body.pageRole !== undefined) updates.page_role = body.pageRole;
  if (body.pageIcon !== undefined) updates.page_icon = body.pageIcon;
  if (body.tagline !== undefined) updates.tagline = body.tagline;
  if (body.toneVoice !== undefined) updates.tone_voice = body.toneVoice;
  if (body.contentPillars !== undefined) updates.content_pillars = body.contentPillars;
  if (body.defaultHashtags !== undefined) updates.default_hashtags = body.defaultHashtags;
  if (body.defaultCta !== undefined) updates.default_cta = body.defaultCta;
  if (body.contentMix !== undefined) updates.content_mix = body.contentMix;
  if (body.socialAccountId !== undefined) updates.social_account_id = body.socialAccountId;
  if (body.isActive !== undefined) updates.is_active = body.isActive;
  if (body.sortOrder !== undefined) updates.sort_order = body.sortOrder;

  const { data, error } = await supabase
    .from('satellite_pages')
    .update(updates)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  return NextResponse.json(data);
}

/** DELETE /api/satellite-pages/[id] — Deactivate a satellite page */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const { id } = await params;

  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from('satellite_pages')
    .update({ is_active: false })
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Page deactivated' });
}
