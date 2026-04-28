import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

/**
 * DELETE /api/accounts/[id]
 * Disconnect (deactivate) a social account
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createAdminSupabase();

  await supabase
    .from('social_accounts')
    .update({ is_active: false })
    .eq('id', id);

  return NextResponse.json({ success: true });
}
