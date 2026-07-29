import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';

export const metadata: Metadata = {
  title: 'Chính Sách Giao Hàng',
  description: 'Chính sách và quy trình giao nhận sản phẩm bia nhập khẩu tại Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com/chinh-sach-giao-hang' },
};

export default function ShippingPolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Thông Tin Vận Chuyển</span>
        <h1 className="page-title">Chính Sách Giao Hàng</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Phạm vi và Thời gian Giao hàng
          </h2>
          <p>
            - Giao hàng nội thành Hà Nội: Giao nhanh trong 2 - 4 giờ làm việc.<br />
            - Giao hàng các tỉnh thành khác: Từ 1 - 3 ngày làm việc tùy khu vực.<br />
            - Thời gian giao hàng: 08:00 - 20:00 tất cả các ngày trong tuần (trừ ngày Lễ, Tết theo quy định).
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Quy định Kiểm Tra Độ Tuổi Khi Giao Nhận [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            - Đơn hàng có chứa sản phẩm đồ uống có cồn bắt buộc phải được nhận bởi người từ đủ 18 tuổi trở lên.<br />
            - Nhân viên giao hàng có quyền kiểm tra giấy tờ tùy thân của người nhận trước khi bàn giao sản phẩm.<br />
            - Trường hợp người nhận không đủ 18 tuổi hoặc từ chối xuất trình giấy tờ, nhân viên giao hàng sẽ hoãn/từ chối giao đơn hàng.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Phí Giao Hàng [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            - Phí giao hàng được tính cụ thể theo khoảng cách và đối tác vận chuyển tại thời điểm xác nhận đơn hàng.<br />
            - Miễn phí vận chuyển áp dụng đối với các đơn hàng đạt giá trị tối thiểu theo chương trình khuyến mại hiện hành.
          </p>
        </section>
      </div>
    </div>
  );
}
