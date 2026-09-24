import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';
import CompanyLegalDetails from '../components/CompanyLegalDetails';
import { COMPANY_CONFIG } from '@/config/company';
import EditorialPage from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng',
  description: 'Nguyên tắc sử dụng website giới thiệu sản phẩm, thông tin thương hiệu và kênh tư vấn của Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com/dieu-khoan-su-dung' },
};

export default function TermsOfUsePage() {
  return (
    <EditorialPage tone="light" hero={{ eyebrow: "Quy Định Chung", title: "Điều Khoản Sử Dụng" }}>
      <AlcoholWarning variant="checkout" style={{ marginBottom: '30px' }} />

      <div>
        <section>
          <h2>1. Tính chất của website</h2>
          <p>
            Website biathaytu.com là kênh giới thiệu sản phẩm và thông tin thương hiệu, không thực hiện chức năng đặt hàng trực tuyến; mọi giao dịch mua bán được thực hiện trực tiếp tại địa điểm kinh doanh hoặc qua các kênh liên hệ được công bố.
          </p>
        </section>

        <section>
          <h2>2. Điều kiện độ tuổi</h2>
          <p>Nội dung về rượu, bia chỉ dành cho người từ đủ 18 tuổi. Người truy cập có trách nhiệm khai báo trung thực thông tin phục vụ việc kiểm soát độ tuổi trước khi truy cập nội dung có liên quan.</p>
        </section>

        <section>
          <h2>3. Thông tin trên website</h2>
          <p>Hình ảnh, mô tả, giá tham khảo, thông số sản phẩm và nội dung tư vấn trên website được cung cấp nhằm mục đích giới thiệu và tham khảo. Thông tin cụ thể về tình trạng hàng, giá áp dụng, phương thức nhận hàng và các điều kiện của một giao dịch sẽ được xác nhận riêng qua kênh liên hệ hoặc tại địa điểm kinh doanh.</p>
        </section>

        <section>
          <h2>4. Quyền sở hữu nội dung</h2>
          <p>Trừ khi có ghi chú khác, nội dung, hình ảnh nhận diện, bố cục và tài liệu trên website thuộc quyền sử dụng hợp pháp của {COMPANY_CONFIG.legalName} hoặc các đối tác cấp quyền. Việc sao chép, sử dụng lại cho mục đích thương mại cần có sự đồng ý phù hợp.</p>
        </section>

        <section>
          <h2>5. Liên kết và kênh liên hệ bên ngoài</h2>
          <p>Website có thể dẫn đến Zalo, email, điện thoại hoặc các nền tảng bên thứ ba để người dùng liên hệ. Khi chuyển sang nền tảng khác, người dùng đồng thời chịu sự điều chỉnh của chính sách và điều khoản của nền tảng đó.</p>
        </section>

        <section>
          <h2>6. Cập nhật điều khoản</h2>
          <p>Nội dung điều khoản có thể được cập nhật khi mô hình vận hành, nội dung website hoặc quy định pháp luật thay đổi. Phiên bản hiển thị trên website là phiên bản đang được áp dụng cho việc sử dụng website.</p>
        </section>

        <section>
          <h2>7. Thông tin đơn vị vận hành</h2>
          <CompanyLegalDetails compact />
        </section>
      </div>
    </EditorialPage>
  );
}
