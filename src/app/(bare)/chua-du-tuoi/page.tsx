'use client';

import { useEffect } from 'react';
import styles from './page.module.css';

export default function UnderagePage() {
  useEffect(() => {
    // Chặn nút Back trên trình duyệt quay lại trang sản phẩm đồ uống có cồn
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Thông báo kiểm soát độ tuổi</h1>

        <p className={styles.lead}>
          Rất tiếc, theo quy định của pháp luật Việt Nam (Luật Phòng, chống tác hại của rượu, bia), người dưới 18 tuổi không được phép tiếp cận thông tin quảng cáo, mua bán hoặc sử dụng sản phẩm đồ uống có cồn.
        </p>

        <div className={styles.note}>
          <strong className={styles.noteTitle}>Thông tin nâng cao nhận thức sức khỏe:</strong>
          <ul>
            <li>Sử dụng rượu, bia ảnh hưởng đến sự phát triển thể chất và trí tuệ ở lứa tuổi thanh thiếu niên.</li>
            <li>Đồ uống có cồn có thể gây tổn thương các cơ quan nội tạng và làm giảm khả năng tập trung học tập.</li>
            <li>Hãy tuân thủ pháp luật và lựa chọn lối sống lành mạnh.</li>
          </ul>
        </div>

        <p className={styles.small}>
          Nếu có nhầm lẫn trong quá trình xác nhận, bạn có thể đóng trình duyệt và quay lại sau khi đã đáp ứng đủ yêu cầu về độ tuổi theo luật định.
        </p>
      </div>
    </div>
  );
}
