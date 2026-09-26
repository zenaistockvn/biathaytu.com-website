import React from 'react';
import type { Metadata } from 'next';
import AlcoholWarning from '../components/AlcoholWarning';
import CompanyLegalDetails from '../components/CompanyLegalDetails';
import { COMPANY_CONFIG } from '@/config/company';
import EditorialPage from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Chính Sách Kiểm Soát Độ Tuổi',
  description: 'Thông tin về cơ chế khai báo và kiểm soát độ tuổi trước khi truy cập nội dung rượu, bia trên website Bia Thầy Tu.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/chinh-sach-kiem-soat-do-tuoi' },
};

export default function AgeControlPolicyPage() {
  return (
    <EditorialPage tone="light" hero={{ eyebrow: "Quy Định Tuân Thủ", title: "Chính Sách Kiểm Soát Độ Tuổi" }}>
      <AlcoholWarning variant="checkout" />

      <div>
        <section>
          <h2>1. Mục đích và phạm vi áp dụng</h2>
          <p>
            Bia Thầy Tu áp dụng cơ chế kiểm soát độ tuổi trước khi người truy cập xem hoặc tìm kiếm nội dung liên quan đến rượu, bia trên website. Nội dung có cồn chỉ dành cho người từ đủ 18 tuổi.
          </p>
        </section>

        <section>
          <h2>2. Quy trình khai báo độ tuổi</h2>
          <p>
            - Người truy cập chưa có trạng thái xác nhận hợp lệ được yêu cầu tự khai báo mình đã từ đủ 18 tuổi trước khi tiếp tục truy cập nội dung website.<br />
            - Người từ đủ 18 tuổi chọn “Tôi đã đủ 18 tuổi”; website lưu cookie trạng thái xác nhận trong 30 ngày để tránh yêu cầu lặp lại ở mỗi lần truy cập.<br />
            - Người chưa đủ 18 tuổi chọn “Tôi chưa đủ 18 tuổi” và nhận thông báo “Rất tiếc, nội dung này chỉ dành cho người từ đủ 18 tuổi.”<br />
            - Cổng kiểm soát không yêu cầu nhập họ tên, ngày sinh, số giấy tờ hoặc dữ liệu định danh.
          </p>
        </section>

        <section>
          <h2>3. Cách xử lý dữ liệu khai báo</h2>
          <p>
            Cơ chế khai báo độ tuổi chỉ lưu cookie trạng thái xác nhận theo phiên bản chính sách. Cookie này không chứa họ tên, ngày sinh, tuổi cụ thể hoặc dữ liệu định danh cá nhân. Website không tạo hồ sơ tuổi từ cổng kiểm soát này.
          </p>
        </section>

        <section>
          <h2>4. Khả năng truy cập và công cụ tìm kiếm</h2>
          <p>
            Cổng kiểm soát được thiết kế để chặn người dùng thực trước khi nội dung hiển thị, hỗ trợ thao tác bàn phím và thiết bị di động. Trình thu thập dữ liệu của các công cụ tìm kiếm được nhận diện kỹ thuật riêng để nội dung công khai vẫn có thể được lập chỉ mục; cơ chế này không tạo đường vòng cho người truy cập thông thường.
          </p>
        </section>

        <section>
          <h2>5. Liên hệ về kiểm soát độ tuổi</h2>
          <p>Nếu cần trao đổi về cơ chế kiểm soát độ tuổi, vui lòng liên hệ hotline <strong>{COMPANY_CONFIG.hotline}</strong> hoặc email <strong>{COMPANY_CONFIG.email}</strong>.</p>
        </section>

        <section>
          <h2>6. Thông tin đơn vị vận hành</h2>
          <CompanyLegalDetails compact />
        </section>
      </div>
    </EditorialPage>
  );
}
