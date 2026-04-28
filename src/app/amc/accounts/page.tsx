import DashboardLayout from '@/components/DashboardLayout';
import { getSocialAccounts, getSatellitePages } from '@/lib/data';
import AccountsClient from './AccountsClient';

export default async function AccountsPage() {
  const [accounts, satellitePages] = await Promise.all([
    getSocialAccounts(),
    getSatellitePages(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Social Accounts</h2>
        <p>Kết nối và quản lý các kênh mạng xã hội của thương hiệu</p>
      </div>
      <AccountsClient initialAccounts={accounts} satellitePages={satellitePages} />
    </DashboardLayout>
  );
}
