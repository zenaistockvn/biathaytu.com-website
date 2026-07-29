import '../web.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông Báo Kiểm Soát Độ Tuổi | Bia Thầy Tu',
  description: 'Trang thông báo dành cho người truy cập chưa đủ 18 tuổi theo Luật Phòng, chống tác hại của rượu, bia.',
  alternates: { canonical: 'https://www.biathaytu.com/chua-du-tuoi' },
  robots: { index: false, follow: false },
};

export default function BareLayout({ children }: { children: React.ReactNode }) {
  return <div className="web-app">{children}</div>;
}
