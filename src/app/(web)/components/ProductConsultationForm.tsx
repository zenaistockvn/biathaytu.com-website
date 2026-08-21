'use client';

import { FormEvent, useState } from 'react';

interface ProductConsultationFormProps {
  productName: string;
}

export default function ProductConsultationForm({ productName }: ProductConsultationFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState(`Tôi muốn được tư vấn về ${productName}.`);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = [
      'Chào Bia Thầy Tu, mình muốn để lại thông tin tư vấn:',
      `Sản phẩm quan tâm: ${productName}`,
      `Họ tên: ${name}`,
      `Điện thoại: ${phone}`,
      email ? `Email: ${email}` : null,
      `Nội dung: ${content}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(`https://zalo.me/0899191313?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="tu-van-san-pham"
      aria-labelledby="tu-van-san-pham-title"
      style={{
        marginTop: '64px',
        padding: '32px',
        border: '1px solid var(--web-border)',
        borderRadius: '16px',
        background: 'var(--web-bg-warm)',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <span className="section-label">Tư Vấn Sản Phẩm</span>
        <h2 id="tu-van-san-pham-title" className="section-title" style={{ marginBottom: '10px' }}>
          Để lại thông tin tư vấn
        </h2>
        <p style={{ margin: '0 0 24px', color: 'var(--web-text-muted)', lineHeight: 1.6 }}>
          Gửi thông tin để đội ngũ Bia Thầy Tu tư vấn thêm về {productName}. Biểu mẫu này không tạo đơn hàng và không thu thập thông tin thanh toán.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span>Họ và tên</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={{ minHeight: '46px', padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span>Số điện thoại</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                style={{ minHeight: '46px', padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff' }}
              />
            </label>
          </div>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span>Email <span style={{ color: 'var(--web-text-muted)', fontSize: '12px' }}>(không bắt buộc)</span></span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ minHeight: '46px', padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span>Nội dung cần tư vấn</span>
            <textarea
              name="content"
              rows={4}
              required
              value={content}
              onChange={(event) => setContent(event.target.value)}
              style={{ padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff', resize: 'vertical' }}
            />
          </label>

          <div>
            <button type="submit" className="btn-primary shimmer-effect">
              Gửi yêu cầu tư vấn qua Zalo
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
