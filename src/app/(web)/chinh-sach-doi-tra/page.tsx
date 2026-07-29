import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả',
  description: 'Quy định về việc đổi trả sản phẩm bia nhập khẩu hỏng, lỗi hoặc vỡ trong quá trình vận chuyển.',
  alternates: { canonical: 'https://www.biathaytu.com/chinh-sach-doi-tra' },
};

export default function ReturnPolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Đảm Bảo Chất Lượng</span>
        <h1 className="page-title">Chính Sách Đổi Trả</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Điều Kiện Đổi Trả
          </h2>
          <p>
            Khách hàng được đổi trả sản phẩm trong các trường hợp sau:<br />
            - Sản phẩm bị vỡ, rò rỉ hoặc móp méo do lỗi vận chuyển.<br />
            - Giao sai chủng loại, số lượng so với đơn đặt hàng.<br />
            - Sản phẩm hết hạn sử dụng hoặc có lỗi kỹ thuật từ nhà sản xuất.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Quy Trình Xử Lý Đổi Trả [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            - Thời hạn phản hồi: Trong vòng 24 giờ kể từ thời điểm nhận hàng.<br />
            - Khách hàng vui lòng giữ nguyên trạng bao bì và quay video/chụp ảnh tình trạng sản phẩm gửi về hotline Hotline 0899.191.313 hoặc email info@biathaytu.com.
          </p>
        </section>
      </div>
    </div>
  );
}
