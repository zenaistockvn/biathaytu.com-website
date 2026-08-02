import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng',
  description: 'Điều khoản và điều kiện giao dịch trực tuyến khi mua đồ uống có cồn tại Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com/dieu-khoan-su-dung' },
};

export default function TermsOfUsePage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Quy Định Chung</span>
        <h1 className="page-title">Điều Khoản Sử Dụng</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Yêu Cầu Độ Tuổi Khách Hàng
          </h2>
          <p>
            Bằng việc truy cập và sử dụng dịch vụ trên website biathaytu.com, người dùng cam kết đã từ đủ 18 tuổi trở lên. Người dưới 18 tuổi nghiêm cấm thực hiện hành vi mua sắm đồ uống có cồn dưới mọi hình thức.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Trách Nhiệm Thông Tin Đặt Hàng
          </h2>
          <p>
            - Khách hàng chịu trách nhiệm về tính chính xác của thông tin người đặt và người nhận hàng.<br />
            - Đơn hàng sẽ bị hủy bỏ và không hoàn tiền dịch vụ nếu phát hiện thông tin giả mạo hoặc vi phạm độ tuổi quy định.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Quyền Hạn và Tuyên Bố Miễn Trách
          </h2>
          <p>
            Website cung cấp thông tin sản phẩm và hỗ trợ đặt hàng trực tuyến theo quy định của pháp luật Việt Nam. Chúng tôi giữ quyền cập nhật, sửa đổi các điều khoản sử dụng mà không cần báo trước.
          </p>
        </section>
      </div>
    </div>
  );
}
