import DashboardLayout from '@/components/DashboardLayout';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Image Gallery | Bia Thầy Tu AMC',
  description: 'Kho ảnh AI-generated cho chiến dịch marketing Bia Thầy Tu',
};

export default function GalleryPage() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Image Gallery</h2>
        <p>Kho ảnh AI-generated cho chiến dịch marketing</p>
      </div>
      <GalleryClient />
    </DashboardLayout>
  );
}
