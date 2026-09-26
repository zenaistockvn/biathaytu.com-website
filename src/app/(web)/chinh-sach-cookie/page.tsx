import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';
import CookieResetButtons from './CookieResetButtons';
import CompanyLegalDetails from '../components/CompanyLegalDetails';
import { COMPANY_CONFIG } from '@/config/company';
import EditorialPage from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Chính Sách Cookie',
  description: 'Thông tin về cookie cần thiết, quyền lựa chọn cookie phân tích và quyền riêng tư khi sử dụng website Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/chinh-sach-cookie' },
};

export default function CookiePolicyPage() {
  return (
    <EditorialPage tone="light" hero={{ eyebrow: "Quyền Riêng Tư", title: "Chính Sách Cookie" }}>
      <AlcoholWarning variant="checkout" />

      <div>
        <section>
          <h2>1. Cookie là gì?</h2>
          <p>Cookie là tệp dữ liệu nhỏ được lưu trên thiết bị khi truy cập website, giúp duy trì các trạng thái cần thiết và ghi nhớ một số lựa chọn của người dùng.</p>
        </section>

        <section>
          <h2>2. Các nhóm cookie và dữ liệu lưu cục bộ</h2>
          <p>
            - <strong>Cookie bắt buộc:</strong> cookie <code>age_verified</code> ghi nhận trạng thái đã hoàn thành khai báo độ tuổi, có thời hạn 30 ngày. Cookie này chỉ chứa phiên bản chính sách xác minh, không chứa họ tên, ngày sinh hoặc tuổi.<br />
            - <strong>Tùy chọn cookie:</strong> người dùng có thể lựa chọn cho phép hoặc từ chối cookie phục vụ phân tích và tiếp thị tại giao diện quản lý cookie.<br />
            - <strong>Lưu lựa chọn cookie:</strong> website có thể lưu cục bộ lựa chọn đồng ý cookie để không hỏi lại ở mỗi lần điều hướng. Dữ liệu này không phải dữ liệu khai báo độ tuổi.
          </p>
        </section>

        <section>
          <h2>3. Quản lý và thay đổi lựa chọn</h2>
          <p>Bạn có thể mở lại giao diện tùy chọn cookie hoặc yêu cầu xác minh lại độ tuổi bằng các công cụ dưới đây:</p>
          <CookieResetButtons />
        </section>

        <section>
          <h2>4. Liên hệ về quyền riêng tư</h2>
          <p>Nếu cần trao đổi về cookie hoặc dữ liệu trên website, vui lòng liên hệ hotline <strong>{COMPANY_CONFIG.hotline}</strong> hoặc email <strong>{COMPANY_CONFIG.email}</strong>.</p>
        </section>

        <section>
          <h2>5. Thông tin đơn vị vận hành</h2>
          <CompanyLegalDetails compact />
        </section>
      </div>
    </EditorialPage>
  );
}
