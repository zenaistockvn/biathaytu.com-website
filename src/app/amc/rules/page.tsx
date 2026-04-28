import DashboardLayout from '@/components/DashboardLayout';
import { getRules, getSatellitePages } from '@/lib/data';
import RulesClientWrapper from './RulesClient';

export default async function RulesPage() {
  const [rules, satellitePages] = await Promise.all([
    getRules(),
    getSatellitePages(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Auto Rules Engine</h2>
        <p>Quy tắc lên lịch tự động cho các luồng Marketing bằng AI</p>
      </div>

      <RulesClientWrapper initialRules={rules} satellitePages={satellitePages} />
    </DashboardLayout>
  );
}
