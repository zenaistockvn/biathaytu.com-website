import DashboardLayout from '@/components/DashboardLayout';
import { getGeneratedContents, getPosts, getActivityLogs, getProducts, getSocialAccounts } from '@/lib/data';
import AnalyticsDashboard from './AnalyticsDashboard';

export default async function AnalyticsPage() {
  const [contents, posts, activityLogs, products, accounts] = await Promise.all([
    getGeneratedContents(),
    getPosts(),
    getActivityLogs(),
    getProducts(),
    getSocialAccounts(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Analytics</h2>
        <p>Thống kê hiệu quả content marketing & AI performance</p>
      </div>

      <AnalyticsDashboard
        contents={contents}
        posts={posts}
        activityLogs={activityLogs}
        productCount={products.length}
        initialAccounts={accounts}
      />
    </DashboardLayout>
  );
}
