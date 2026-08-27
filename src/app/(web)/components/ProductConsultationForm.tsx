'use client';

import { FormEvent, useState } from 'react';
import { COMPANY_CONFIG, getCompanyZaloUrl } from '@/config/company';

interface ProductConsultationFormProps {
  productName: string;
}

export default function ProductConsultationForm({ productName }: ProductConsultationFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState(`Tôi muốn được tư vấn về ${productName}.`);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [errorField, setErrorField] = useState<string | null>(null);
  const feedbackId = 'consultation-form-feedback';
  const zaloUrl = getCompanyZaloUrl();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setFeedback('');
    setErrorField(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, content, productName }),
      });
      const result = await response.json().catch(() => null) as {
        message?: string;
        error?: string;
        field?: string;
      } | null;

      if (!response.ok) {
        setStatus('error');
        setErrorField(result?.field || null);
        setFeedback(result?.error || `Chưa thể gửi yêu cầu. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.`);
        return;
      }

      setStatus('success');
      setFeedback(result?.message || 'Yêu cầu tư vấn đã được ghi nhận. Đội ngũ Bia Thầy Tu sẽ liên hệ lại sớm.');
    } catch {
      setStatus('error');
      setFeedback(`Không thể kết nối hệ thống tư vấn. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.`);
    }
  };

  const describedBy = (field: string) => (
    status === 'error' && (!errorField || errorField === field) ? feedbackId : undefined
  );

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

        <form onSubmit={handleSubmit} aria-busy={status === 'submitting'} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span>Họ và tên <span aria-hidden="true">*</span></span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                aria-invalid={status === 'error' && errorField === 'name'}
                aria-describedby={describedBy('name')}
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={{ minHeight: '46px', padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span>Số điện thoại <span aria-hidden="true">*</span></span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
                aria-invalid={status === 'error' && errorField === 'phone'}
                aria-describedby={describedBy('phone')}
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
              aria-invalid={status === 'error' && errorField === 'email'}
              aria-describedby={describedBy('email')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ minHeight: '46px', padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span>Nội dung cần tư vấn <span aria-hidden="true">*</span></span>
            <textarea
              name="content"
              rows={4}
              required
              aria-invalid={status === 'error' && errorField === 'content'}
              aria-describedby={describedBy('content')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              style={{ padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '8px', background: '#fff', resize: 'vertical' }}
            />
          </label>

          {status === 'success' || status === 'error' ? (
            <div
              id={feedbackId}
              role={status === 'success' ? 'status' : 'alert'}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: status === 'success' ? '#e8f5eb' : '#fff1f0',
                color: status === 'success' ? '#1d5c2e' : '#8b1e1e',
                lineHeight: 1.5,
              }}
            >
              {feedback}
              {status === 'error' && zaloUrl ? (
                <>{' '}<a href={zaloUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'underline' }}>Nhắn Zalo để được hỗ trợ</a>.</>
              ) : null}
            </div>
          ) : null}

          <div>
            <button type="submit" className="btn-primary shimmer-effect" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu tư vấn'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
