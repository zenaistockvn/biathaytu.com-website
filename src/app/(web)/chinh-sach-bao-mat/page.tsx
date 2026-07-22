import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description: 'Cam kết bảo vệ dữ liệu cá nhân và quyền riêng tư của người dùng tại Bia Thầy Tu.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Quyền Riêng Tư</span>
        <h1 className="page-title">Chính Sách Bảo Mật</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Thu Thập và Sử Dụng Thông Tin Dữ Liệu
          </h2>
          <p>
            - Chúng tôi thu thập các thông tin cá nhân cơ bản (Họ tên, SĐT, Địa chỉ) chỉ cho mục đích xử lý và vận chuyển đơn hàng mua sắm đồ uống.<br />
            - Dữ liệu độ tuổi xác minh tại Age Gate chỉ được lưu dạng cờ Boolean (`age_verified=true`) và timestamp. Chúng tôi TUYỆT ĐỐI không lưu trữ Họ tên hoặc Ngày tháng năm sinh nhập tại giao diện xác minh độ tuổi.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Chia Sẻ Thông Tin Ngược Với Nền Tảng Bên Thứ Ba
          </h2>
          <p>
            - Dữ liệu thông tin cá nhân của người dùng sẽ không bị gửi lên `dataLayer`, Google Analytics, Meta Pixel hoặc các dịch vụ tiếp thị khác.<br />
            - Các mã theo dõi (Pixel/Analytics) chỉ hoạt động sau khi có sự đồng ý rõ ràng của người dùng thông qua Cookie Consent.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Quyền Của Người Dùng [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            Người dùng có quyền kiểm tra, cập nhật, điều chỉnh hoặc yêu cầu hủy bỏ thông tin cá nhân đã đăng ký bất kỳ lúc nào bằng cách liên hệ với ban quản trị website.
          </p>
        </section>
      </div>
    </div>
  );
}
