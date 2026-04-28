import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const token = request.headers.get('authorization');

    // Secure webhook with simple token
    const secretToken = process.env.SUPABASE_WEBHOOK_SECRET || 'dev_secret_token';
    
    if (token !== `Bearer ${secretToken}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const table = payload.table;
    const action = payload.type; // INSERT, UPDATE, DELETE

    console.log(`Webhook received for table: ${table}, action: ${action}`);

    if (table === 'seo_articles') {
      // Revalidate blog listing and specific blog post if it's an update
      revalidatePath('/blog');
      revalidatePath('/'); // homepage has latest articles
      
      const record = payload.record;
      if (record && record.slug) {
        revalidatePath(`/blog/${record.slug}`);
      }
    } else if (table === 'products') {
      // Revalidate product listing and homepage (featured products)
      revalidatePath('/san-pham');
      revalidatePath('/');
      
      const record = payload.record;
      if (record && record.slug) {
        revalidatePath(`/san-pham/${record.slug}`);
      }
    } else {
      // Fallback: revalidate major public routes
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/san-pham');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}
