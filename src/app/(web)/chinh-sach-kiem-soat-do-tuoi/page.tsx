import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Chính Sách Kiểm Soát Độ Tuổi',
  description: 'Quy trình và quy định kiểm soát độ tuổi khách hàng truy cập và mua đồ uống có cồn tại Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com/chinh-sach-kiem-soat-do-tuoi' },
};

export default function AgeControlPolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Quy Định Tuân Thủ</span>
        <h1 className="page-title">Chính Sách Kiểm Soát Độ Tuổi</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Mục đích và Phạm vi áp dụng
          </h2>
          <p>
            Nhằm tuân thủ Luật Phòng, chống tác hại của rượu, bia số 44/2019/QH14 và các quy định pháp luật liên quan đến kinh doanh đồ uống có cồn thương mại điện tử, Bia Thầy Tu áp dụng hệ thống xác minh độ tuổi nghiêm ngặt trên toàn bộ nền tảng.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Quy trình Xác minh Độ tuổi trên Website
          </h2>
          <p>
            - Mọi người dùng khi truy cập website biathaytu.com phải thực hiện xác minh độ tuổi qua giao diện kiểm soát trước khi xem chi tiết sản phẩm.<br />
            - Khách hàng bắt buộc cung cấp Họ tên, Ngày tháng năm sinh và cam kết thông tin chính xác.<br />
            - Hệ thống sẽ từ chối truy cập và chuyển hướng người dùng dưới 18 tuổi sang trang trung lập không chứa thông tin sản phẩm bia.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Xác minh Độ tuổi khi Giao hàng
          </h2>
          <p>
            - Đơn hàng có sản phẩm đồ uống có cồn bắt buộc đối soát người nhận từ đủ 18 tuổi.<br />
            - Nhân viên giao hàng có quyền yêu cầu xuất trình giấy tờ tùy thân (CCCD/CMND/GBLX) của người nhận hàng.<br />
            - Từ chối giao hàng nếu người nhận không đủ 18 tuổi hoặc không thể cung cấp giấy tờ xác minh.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            4. Bảo vệ Dữ liệu Cá nhân
          </h2>
          <p>
            Hệ thống chỉ lưu trữ trạng thái đã xác minh (`age_verified=true`) và thời điểm xác minh. Thông tin Họ tên và Ngày sinh thô nhập tại Age Gate không được lưu vào cookie, localStorage hay chia sẻ với bất kỳ nền tảng phân tích/tiếp thị nào.
          </p>
        </section>
      </div>
    </div>
  );
}
