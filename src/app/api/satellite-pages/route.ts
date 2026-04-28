import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

/** GET /api/satellite-pages — List all satellite pages */
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('satellite_pages')
    .select('*, social_accounts(account_name, is_active)')
    .eq('tenant_id', tenantId)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/satellite-pages — Create a new satellite page */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();

  if (!body.pageName || !body.pageSlug) {
    return NextResponse.json(
      { error: 'pageName and pageSlug are required' },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('satellite_pages')
    .insert({
      tenant_id: tenantId,
      page_name: body.pageName,
      page_slug: body.pageSlug,
      page_role: body.pageRole ?? 'satellite',
      page_icon: body.pageIcon ?? null,
      tagline: body.tagline ?? null,
      tone_voice: body.toneVoice ?? null,
      content_pillars: body.contentPillars ?? [],
      default_hashtags: body.defaultHashtags ?? [],
      default_cta: body.defaultCta ?? null,
      content_mix: body.contentMix ?? {},
      social_account_id: body.socialAccountId ?? null,
      sort_order: body.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
