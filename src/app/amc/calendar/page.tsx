import DashboardLayout from '@/components/DashboardLayout';
import { getPosts, getContentCalendar } from '@/lib/data';
import CalendarClientWrapper from './CalendarClient';

export default async function CalendarPage() {
  const [posts, calendarEntries] = await Promise.all([
    getPosts(),
    getContentCalendar(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Calendar</h2>
        <p>Lịch duyệt bài và quản lý chiến dịch nội dung tự động</p>
      </div>

      <CalendarClientWrapper initialPosts={posts} calendarEntries={calendarEntries} />
    </DashboardLayout>
  );
}
