import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Chính Sách Cookie',
  description: 'Thông tin quy định sử dụng cookie và quản lý quyền riêng tư tại Bia Thầy Tu.',
};

export default function CookiePolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Quyền Riêng Tư</span>
        <h1 className="page-title">Chính Sách Cookie</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Cookie là gì?
          </h2>
          <p>
            Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website nhằm ghi nhớ các lựa chọn của bạn và hỗ trợ trải nghiệm duyệt web.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Phân Loại Cookie Sử Dụng [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            - <strong>Cookie Bắt Buộc (Essential):</strong> Lưu giữ trạng thái giỏ hàng, phiên đăng nhập và cờ xác minh độ tuổi (`age_verified`). Không thể tắt.<br />
            - <strong>Cookie Phân Tích (Analytics):</strong> Thu thập dữ liệu truy cập ẩn danh để cải thiện giao diện và hiệu năng.<br />
            - <strong>Cookie Tiếp Thị (Marketing):</strong> Đo lường quảng cáo trực tuyến. Chỉ hoạt động khi có sự đồng ý của bạn.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Quản Lý và Thay Đổi Lựa Chọn
          </h2>
          <p>
            Bạn có thể thay đổi thiết lập đồng ý Cookie bất cứ lúc nào thông qua liên kết &quot;Cài đặt Cookie&quot; tại chân trang (footer).
          </p>
        </section>
      </div>
    </div>
  );
}
