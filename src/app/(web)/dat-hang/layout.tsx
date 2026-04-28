import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh Toán | Bia Thầy Tu',
  description: 'Hoàn tất đơn hàng của bạn tại Bia Thầy Tu. Đặt hàng nhanh chóng, giao hàng tận nơi.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
