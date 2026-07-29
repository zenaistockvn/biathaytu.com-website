import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nhận Ưu Đãi Bia Đức — Quà Tặng Độc Quyền',
  description: 'Đăng ký nhận ưu đãi và quà tặng độc quyền từ Bia Thầy Tu. Bia Đức nhập khẩu chính hãng, giao hàng toàn quốc.',
  alternates: { canonical: 'https://www.biathaytu.com/nhan-uu-dai' },
};

export default function NhanUuDaiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
