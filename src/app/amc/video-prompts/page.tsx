import DashboardLayout from '@/components/DashboardLayout';
import VideoPromptsClient from './VideoPromptsClient';

export const metadata = {
  title: 'Video Prompts | Bia Thầy Tu AMC',
  description: 'Thư viện prompt video AI cho Seedance 2.0 & Google Veo 3',
};

export default function VideoPromptsPage() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>🎬 Video Prompts</h2>
        <p>Thư viện prompt video AI cho Seedance 2.0 & Google Veo 3</p>
      </div>
      <VideoPromptsClient />
    </DashboardLayout>
  );
}
