import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const token = request.headers.get('authorization');

    // [S1 FIX] Require env var — no fallback secret
    const secretToken = process.env.SUPABASE_WEBHOOK_SECRET;
    if (!secretToken) {
      console.error('SUPABASE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
    }
    
    if (token !== `Bearer ${secretToken}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const table = payload.table;
    const action = payload.type; // INSERT, UPDATE, DELETE

    // [SEO3 FIX] Use correct route paths: /kien-thuc, not /blog
    if (table === 'seo_articles') {
      revalidatePath('/kien-thuc');
      revalidatePath('/'); // homepage has latest articles
      
      const record = payload.record;
      if (record && record.slug) {
        revalidatePath(`/kien-thuc/${record.slug}`);
      }
    } else if (table === 'products') {
      revalidatePath('/san-pham');
      revalidatePath('/');
      
      const record = payload.record;
      if (record && record.slug) {
        revalidatePath(`/san-pham/${record.slug}`);
      }
    } else {
      // Fallback: revalidate major public routes
      revalidatePath('/');
      revalidatePath('/kien-thuc');
      revalidatePath('/san-pham');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Revalidation error:', message);
    return NextResponse.json({ message: 'Error revalidating', error: message }, { status: 500 });
  }
}
