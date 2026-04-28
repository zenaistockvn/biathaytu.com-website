import DashboardLayout from '@/components/DashboardLayout';
import { createAdminSupabase } from '@/lib/supabase/server';
import HistoryClient from './HistoryClient';
import type { Post } from '@/types';

export const metadata = {
  title: 'AMC | Lịch sử Đăng bài',
  description: 'Theo dõi tiến trình xuất bản nội dung lên mạng xã hội',
};

export default async function HistoryPage() {
  const supabase = createAdminSupabase();

  // Fetch only posts that have attempted publishing (either succeeded or failed)
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      products (name)
    `)
    .in('status', ['published', 'failed'])
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('scheduled_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching publishing history:', error);
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>⏱️ Lịch sử Đăng bài</h2>
        <p>Theo dõi kết quả các chiến dịch xuất bản nội dung tự động</p>
      </div>

      <HistoryClient initialPosts={(posts || []) as Post[]} />
    </DashboardLayout>
  );
}
