import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
    }

    const body = await request.json();
    const { caption, hashtags } = body;

    // Use service role key to bypass RLS for now (as per architecture decision)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('generated_contents')
      .update({
        caption: caption,
        hashtags: hashtags,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API content PUT] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API content PUT] Internal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
    }

    const updates = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('generated_contents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API content PATCH] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API content PATCH] Internal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
