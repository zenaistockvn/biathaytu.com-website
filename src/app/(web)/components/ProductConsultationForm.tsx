'use client';

import { FormEvent, useState } from 'react';
import { COMPANY_CONFIG, getCompanyZaloUrl } from '@/config/company';
import styles from './ProductConsultationForm.module.css';

export default function ProductConsultationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [content, setContent] = useState('');
  const [interest, setInterest] = useState('');
  const [region, setRegion] = useState('');
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
        body: JSON.stringify({ name, phone, email, content: `Nhu cầu: ${interest}\nKhu vực: ${region}\n${content}`, productName: interest, page: window.location.pathname, website }),
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
      id="dang-ky-hop-tac"
      aria-labelledby="dang-ky-hop-tac-title"
      className={styles.section}
    >
      <div className={styles.inner}>
        <span className="section-label">Hợp tác phân phối</span>
        <h2 id="dang-ky-hop-tac-title" className={`section-title ${styles.title}`}>
          Đăng ký hợp tác
        </h2>
        <p className={styles.lead}>
          Anh chị để lại thông tin nếu muốn làm đại lý, nhà phân phối hoặc phát triển hệ thống cùng Bia Thầy Tu.
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

          {/* Ô bẫy bot (giống form gt.vn): người dùng không thấy, bot tự điền thì yêu cầu bị bỏ qua. */}
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
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

          <div className={styles.pair}>
            <label className={styles.field}>
              <span>Nhu cầu hợp tác <span aria-hidden="true">*</span></span>
              <select name="interest" required value={interest} onChange={(event) => setInterest(event.target.value)} className={styles.input}>
                <option value="">Chọn nhu cầu</option>
                <option value="Đại lý">Đại lý</option>
                <option value="Nhà phân phối">Nhà phân phối</option>
                <option value="Phát triển hệ thống">Phát triển hệ thống</option>
                <option value="Nhà hàng, khách sạn">Nhà hàng, khách sạn</option>
                <option value="Hợp tác khác">Hợp tác khác</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Tỉnh, thành phố <span aria-hidden="true">*</span></span>
              <input name="region" required value={region} onChange={(event) => setRegion(event.target.value)} className={styles.input} />
            </label>
          </div>

          <label className={styles.field}>
            <span>Thông tin về đơn vị và nhu cầu hợp tác <span aria-hidden="true">*</span></span>
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
              {status === 'submitting' ? 'Đang gửi yêu cầu...' : 'Gửi đăng ký hợp tác'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
