import DashboardLayout from '@/components/DashboardLayout';
import { getProducts, getGeneratedContents, getSatellitePages } from '@/lib/data';
import LibraryClientWrapper from './LibraryClient';

export default async function LibraryPage() {
  const [products, contents, satellitePages] = await Promise.all([
    getProducts(),
    getGeneratedContents(),
    getSatellitePages(),
  ]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Content Library</h2>
        <p>Quản lý sản phẩm và kho content marketing</p>
      </div>

      <LibraryClientWrapper initialProducts={products} initialContents={contents} satellitePages={satellitePages} />
    </DashboardLayout>
  );
}
