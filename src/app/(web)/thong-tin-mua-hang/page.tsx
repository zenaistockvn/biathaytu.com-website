import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AlcoholWarning from '../components/AlcoholWarning';
import ZaloCTA from '../components/ZaloCTA';

export const metadata: Metadata = {
  title: 'Thông Tin Mua Hàng',
  description: 'Thông tin tham khảo về cách liên hệ mua sản phẩm, phương thức thanh toán, giao nhận và đổi trả tại Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com/thong-tin-mua-hang' },
};

export default function PurchaseInformationPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Thông Tin Tham Khảo</span>
        <h1 className="page-title">Thông Tin Mua Hàng</h1>
        <p className="page-subtitle" style={{ maxWidth: '720px', margin: '12px auto 0' }}>
          Website không thực hiện đặt hàng trực tuyến. Nội dung dưới đây giúp khách hàng hiểu cách liên hệ, thanh toán, nhận hàng và yêu cầu hỗ trợ sau khi một giao dịch đã được xác nhận qua kênh liên hệ hoặc tại địa điểm kinh doanh.
        </p>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: 1.8, color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '28px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '19px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            1. Tính chất của thông tin này
          </h2>
          <p style={{ margin: 0 }}>
            Đây là thông tin tham khảo về quy trình hỗ trợ khách hàng, không phải điều khoản giao dịch trực tuyến và không tạo thành một đơn hàng khi người dùng chỉ xem sản phẩm, điền form tư vấn hoặc nhắn tin qua website.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            2. Cách liên hệ để mua sản phẩm
          </h2>
          <p>
            Khách hàng có thể liên hệ hotline <a href="tel:0899191313"><strong>0899.191.313</strong></a>, nhắn Zalo, email <a href="mailto:info@biathaytu.com">info@biathaytu.com</a> hoặc đến địa điểm kinh doanh tại <strong>659A Lạc Long Quân, Phường Tây Hồ, Hà Nội</strong>. Nhân viên sẽ trao đổi trực tiếp về sản phẩm phù hợp, giá áp dụng, số lượng, tình trạng hàng và phương án nhận hàng.
          </p>
          <div style={{ marginTop: '14px' }}>
            <ZaloCTA label="Liên hệ tư vấn qua Zalo" />
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            3. Xác nhận giao dịch
          </h2>
          <p>
            Một giao dịch chỉ được xác lập sau khi khách hàng và đơn vị bán hàng thống nhất trực tiếp về sản phẩm, số lượng, giá, phương thức thanh toán và cách nhận hàng. Việc xem giá tham khảo hoặc gửi yêu cầu tư vấn trên website không đồng nghĩa với việc đơn hàng đã được tạo hoặc chấp nhận.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            4. Phương thức thanh toán được hỗ trợ
          </h2>
          <p>
            Tùy giao dịch thực tế, khách hàng có thể được hỗ trợ các phương thức thanh toán không dùng tiền mặt như chuyển khoản ngân hàng, QR hoặc phương thức điện tử khác được hai bên xác nhận. Trường hợp giao dịch trực tiếp tại địa điểm kinh doanh, phương thức thanh toán sẽ được thống nhất tại thời điểm mua.
          </p>
          <p style={{ marginTop: '10px', color: '#64748b', fontSize: '14px' }}>
            Website không thu thập thông tin thẻ, tài khoản ngân hàng hoặc dữ liệu thanh toán của khách hàng.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            5. Giao nhận và kiểm soát độ tuổi
          </h2>
          <p>
            Phạm vi, thời gian và chi phí giao nhận được trao đổi và xác nhận theo từng giao dịch, căn cứ vào địa điểm nhận hàng, loại sản phẩm và phương án vận chuyển phù hợp. Với sản phẩm có cồn, người nhận phải từ đủ 18 tuổi; đơn vị giao hàng hoặc người bàn giao có thể yêu cầu xác minh độ tuổi khi cần thiết.
          </p>
          <p style={{ marginTop: '10px' }}>
            Tại Hà Nội, đơn vị có thể hỗ trợ phương án giao trong ngày khi khách hàng đặt qua hotline và điều kiện vận hành tại thời điểm đó cho phép.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            6. Đổi trả đối với giao dịch đã phát sinh
          </h2>
          <p>
            Sau khi giao dịch đã được xác nhận và hàng đã được bàn giao, khách hàng có thể liên hệ để được xem xét hỗ trợ nếu sản phẩm bị vỡ, rò rỉ, giao sai chủng loại/số lượng, hết hạn sử dụng hoặc có lỗi từ nhà sản xuất. Khách hàng nên giữ nguyên hiện trạng, bao bì và cung cấp ảnh/video tình trạng sản phẩm để việc kiểm tra được nhanh hơn.
          </p>
          <p style={{ marginTop: '10px' }}>
            Để được hỗ trợ thuận tiện, khách hàng nên phản hồi trong vòng 24 giờ kể từ khi nhận hàng. Kết quả xử lý phụ thuộc vào tình trạng thực tế, bằng chứng liên quan và nội dung đã được hai bên xác nhận trong giao dịch cụ thể.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>
            7. Cần hỗ trợ thêm?
          </h2>
          <p>
            Gọi <a href="tel:0899191313"><strong>0899.191.313</strong></a>, nhắn Zalo hoặc xem trang <Link href="/lien-he"><strong>Liên hệ</strong></Link> để trao đổi trực tiếp với đội ngũ tư vấn.
          </p>
        </section>
      </div>
    </div>
  );
}
