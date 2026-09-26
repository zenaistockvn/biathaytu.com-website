'use client';

import { FormEvent, useState } from 'react';
import { COMPANY_CONFIG, getCompanyZaloUrl } from '@/config/company';
import styles from './ProductConsultationForm.module.css';

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
      className={styles.section}
    >
      <div className={styles.inner}>
        <span className="section-label">Tư Vấn Sản Phẩm</span>
        <h2 id="tu-van-san-pham-title" className={`section-title ${styles.title}`}>
          Để lại thông tin tư vấn
        </h2>
        <p className={styles.lead}>
          Gửi thông tin để đội ngũ Bia Thầy Tu tư vấn thêm về {productName}. Biểu mẫu này không tạo đơn hàng và không thu thập thông tin thanh toán.
        </p>

        <form onSubmit={handleSubmit} aria-busy={status === 'submitting'} className={styles.form}>
          <div className={styles.pair}>
            <label className={styles.field}>
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
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
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
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Email <span className={styles.optional}>(không bắt buộc)</span></span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              aria-invalid={status === 'error' && errorField === 'email'}
              aria-describedby={describedBy('email')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
            />
          </label>

          <label className={styles.field}>
            <span>Nội dung cần tư vấn <span aria-hidden="true">*</span></span>
            <textarea
              name="content"
              rows={4}
              required
              aria-invalid={status === 'error' && errorField === 'content'}
              aria-describedby={describedBy('content')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className={`${styles.input} ${styles.textarea}`}
            />
          </label>

          {status === 'success' || status === 'error' ? (
            <div
              id={feedbackId}
              role={status === 'success' ? 'status' : 'alert'}
              className={`${styles.feedback} ${status === 'success' ? styles.success : styles.error}`}
            >
              {feedback}
              {status === 'error' && zaloUrl ? (
                <>{' '}<a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={styles.feedbackLink}>Mở Zalo để được hỗ trợ</a>.</>
              ) : null}
            </div>
          ) : null}

          <div>
            <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu tư vấn'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
