'use client';

import React, { useEffect } from 'react';

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
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '40px 28px',
          border: '1px solid #334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#fbbf24',
            marginBottom: '16px',
            fontFamily: 'var(--font-serif, serif)',
          }}
        >
          Thông Báo Kiểm Soát Độ Tuổi
        </h1>
        
        <p
          style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#cbd5e1',
            marginBottom: '24px',
          }}
        >
          Rất tiếc, theo quy định của pháp luật Việt Nam (Luật Phòng, chống tác hại của rượu, bia), người dưới 18 tuổi không được phép tiếp cận thông tin quảng cáo, mua bán hoặc sử dụng sản phẩm đồ uống có cồn.
        </p>

        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'left',
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: '1.6',
            marginBottom: '28px',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '6px' }}>
            Thông tin nâng cao nhận thức sức khỏe:
          </strong>
          - Sử dụng rượu, bia ảnh hưởng đến sự phát triển thể chất và trí tuệ ở lứa tuổi thanh thiếu niên.<br />
          - Đồ uống có cồn có thể gây tổn thương các cơ quan nội tạng và làm giảm khả năng tập trung học tập.<br />
          - Hãy tuân thủ pháp luật và lựa chọn lối sống lành mạnh.
        </div>

        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Nếu có nhầm lẫn trong quá trình xác nhận, bạn có thể đóng trình duyệt và quay lại sau khi đã đáp ứng đủ yêu cầu về độ tuổi theo luật định.
        </p>
      </div>
    </div>
  );
}
