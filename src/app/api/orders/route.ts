import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = createAdminSupabase();

    let query = (supabase as any)
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_phone.ilike.%${search}%`);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Fetch orders error:', error);
      return NextResponse.json({ error: 'Lỗi khi tải đơn hàng' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, admin_note } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID đơn hàng' }, { status: 400 });
    }

    const supabase = createAdminSupabase();
    
    const updateData: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (admin_note !== undefined) updateData.admin_note = admin_note;

    const { data, error } = await (supabase as any)
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update order error:', error);
      return NextResponse.json({ error: 'Lỗi khi cập nhật đơn hàng' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
