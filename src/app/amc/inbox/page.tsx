import DashboardLayout from '@/components/DashboardLayout';
import { getSocialAccounts } from '@/lib/data';
import InboxClient from './InboxClient';

export default async function InboxPage() {
  const accounts = await getSocialAccounts();

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: "1rem" }}>
        <h2>Unified Inbox</h2>
        <p>Quản lý tin nhắn từ tất cả nền tảng mạng xã hội</p>
      </div>
      <InboxClient initialAccounts={accounts} />
    </DashboardLayout>
  );
}
