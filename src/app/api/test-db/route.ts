import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKeyLength = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0;
    
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category')
      .eq('category', 'bia');

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        url,
        anonKeyLength,
      });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      url,
      anonKeyLength,
      sample: data?.slice(0, 2) || [],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
