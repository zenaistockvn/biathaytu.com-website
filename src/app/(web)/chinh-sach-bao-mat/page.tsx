import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';
import CompanyLegalDetails from '../components/CompanyLegalDetails';
import { COMPANY_CONFIG } from '@/config/company';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description: 'Thông tin bảo vệ dữ liệu cá nhân và quyền riêng tư khi truy cập website Bia Thầy Tu và sử dụng các kênh tư vấn.',
  alternates: { canonical: 'https://www.biathaytu.com/chinh-sach-bao-mat' },
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
            1. Thông tin được xử lý trên website
          </h2>
          <p>
            Website chủ yếu cung cấp nội dung giới thiệu sản phẩm và thương hiệu. Khi người dùng chủ động gửi yêu cầu tư vấn, biểu mẫu có thể xử lý họ tên, số điện thoại, email tùy chọn và nội dung cần tư vấn để hỗ trợ liên hệ lại. Website không yêu cầu thông tin thẻ hoặc dữ liệu thanh toán.
          </p>
          <p>
            Tại cổng khai báo độ tuổi, họ tên và ngày sinh chỉ được dùng tạm thời trong trình duyệt để kiểm tra điều kiện từ đủ 18 tuổi. Các dữ liệu này không được gửi về server, không lưu vào cơ sở dữ liệu và không lưu vào cookie hoặc localStorage. Sau khi xác minh thành công, website chỉ lưu cookie trạng thái xác minh theo phiên bản chính sách trong thời hạn 30 ngày.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Phân tích và tiếp thị
          </h2>
          <p>
            Cookie hoặc công cụ phân tích/tiếp thị tùy chọn chỉ được kích hoạt theo lựa chọn của người dùng tại giao diện quản lý cookie. Thông tin họ tên và ngày sinh nhập tại cổng kiểm soát độ tuổi không được đưa vào dataLayer, Google Analytics, Meta Pixel hoặc nền tảng tiếp thị khác.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            3. Quyền và kênh liên hệ của người dùng
          </h2>
          <p>
            Người dùng có thể liên hệ đơn vị vận hành để hỏi về dữ liệu đã chủ động cung cấp qua các kênh tư vấn, hoặc yêu cầu cập nhật/xử lý phù hợp theo quy định áp dụng. Kênh liên hệ hiện được công bố là hotline <strong>{COMPANY_CONFIG.hotline}</strong> và email <strong>{COMPANY_CONFIG.email}</strong>.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            4. Thông tin đơn vị vận hành
          </h2>
          <CompanyLegalDetails compact />
        </section>
      </div>
    </div>
  );
}
