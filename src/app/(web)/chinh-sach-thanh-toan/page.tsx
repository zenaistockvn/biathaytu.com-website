import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';
import { BANK_CONFIG } from '@/constants/compliance';

export const metadata: Metadata = {
  title: 'Chính Sách Thanh Toán',
  description: 'Các hình thức và quy định thanh toán hợp lệ tại Bia Thầy Tu.',
};

export default function PaymentPolicyPage() {
  return (
    <div className="subpage-wrap container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
      <div className="section-header-center" style={{ marginBottom: '40px' }}>
        <span className="section-label">Phương Thức Giao Dịch</span>
        <h1 className="page-title">Chính Sách Thanh Toán</h1>
      </div>

      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '15px' }}>
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            1. Chuyển Khoản Ngân Hàng / QR Ngân Hàng (Khuyên Dùng)
          </h2>
          <p>
            Quý khách có thể lựa chọn thanh toán không dùng tiền mặt qua hình thức chuyển khoản trực tiếp:
          </p>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginTop: '10px' }}>
            <p style={{ margin: '4px 0' }}><strong>Ngân hàng:</strong> {BANK_CONFIG.bankName}</p>
            <p style={{ margin: '4px 0' }}><strong>Số tài khoản:</strong> {BANK_CONFIG.accountNumber}</p>
            <p style={{ margin: '4px 0' }}><strong>Chủ tài khoản:</strong> {BANK_CONFIG.accountHolder}</p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>Cú pháp chuyển khoản: [Mã đơn hàng] - [Số điện thoại]</p>
          </div>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            2. Thanh Toán Khi Nhận Hàng (COD) [CẦN PHÁP CHẾ XÁC NHẬN]
          </h2>
          <p>
            - Áp dụng cho các đơn hàng bán lẻ đạt điều kiện.<br />
            - Khi nhận hàng và thanh toán COD, người nhận hàng bắt buộc phải tuân thủ quy định kiểm soát độ tuổi (từ đủ 18 tuổi trở lên).<br />
            - Nhân viên giao hàng có quyền từ chối nhận tiền và giao sản phẩm nếu người nhận không xác minh được độ tuổi hợp lệ.
          </p>
        </section>
      </div>
    </div>
  );
}
