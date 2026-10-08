'use client';

import { FormEvent, useState } from 'react';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import { Button } from './ui/Button';
import styles from './FranchiseConsultationForm.module.css';

export default function FranchiseConsultationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [model, setModel] = useState('Monastic Beer Bistro (80 - 150m²)');
  const [premises, setPremises] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [errorField, setErrorField] = useState<string | null>(null);

  const telHref = getCompanyTelHref();
  const zaloUrl = getCompanyZaloUrl();
  const feedbackId = 'franchise-form-feedback';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setFeedback('');
    setErrorField(null);

    const fullContent = [
      `Yêu cầu: Tư vấn nhượng quyền nhà hàng Bia Thầy Tu`,
      `Khu vực: ${city}`,
      `Mô hình quan tâm: ${model}`,
      `Hiện trạng mặt bằng: ${premises || 'Đang tìm kiếm'}`,
      `Ghi chú: ${notes || 'Không có'}`,
    ].join('\n');

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          content: fullContent,
          productName: 'Nhượng quyền nhà hàng Bia Thầy Tu',
          page: window.location.pathname,
        }),
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
      setFeedback(result?.message || 'Yêu cầu tư vấn nhượng quyền đã được gửi thành công. Ban phát triển mạng lưới Bia Thầy Tu sẽ liên hệ trực tiếp trong vòng 24 giờ làm việc.');
    } catch {
      setStatus('error');
      setFeedback(`Không thể kết nối hệ thống tư vấn. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.`);
    }
  };

  const describedBy = (field: string) => (
    status === 'error' && (!errorField || errorField === field) ? feedbackId : undefined
  );

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h3 className={styles.title}>Đăng ký tư vấn nhượng quyền</h3>
        <p className={styles.description}>
          Vui lòng điền thông tin dự kiến đầu tư. Đội ngũ phát triển chuỗi nhà hàng Bia Thầy Tu sẽ phân tích và phản hồi kế hoạch chi tiết.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="franchise-name" className={styles.label}>
              Họ và tên <span className={styles.required}>*</span>
            </label>
            <input
              id="franchise-name"
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              aria-describedby={describedBy('name')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="franchise-phone" className={styles.label}>
              Số điện thoại <span className={styles.required}>*</span>
            </label>
            <input
              id="franchise-phone"
              type="tel"
              required
              placeholder="0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              aria-describedby={describedBy('phone')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="franchise-email" className={styles.label}>
              Email liên hệ
            </label>
            <input
              id="franchise-email"
              type="email"
              placeholder="doitac@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              aria-describedby={describedBy('email')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="franchise-city" className={styles.label}>
              Khu vực dự kiến mở <span className={styles.required}>*</span>
            </label>
            <select
              id="franchise-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.select}
            >
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Quảng Ninh">Quảng Ninh</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Tỉnh thành khác">Tỉnh thành khác</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="franchise-model" className={styles.label}>
              Mô hình quan tâm
            </label>
            <select
              id="franchise-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={styles.select}
            >
              <option value="Monastic Beer Bistro (80 - 150m²)">Monastic Beer Bistro (80 - 150m²)</option>
              <option value="Grand Bavarian Beer Garden (200 - 500m²)">Grand Bavarian Beer Garden (200 - 500m²)</option>
              <option value="Cần tư vấn mô hình tối ưu">Cần tư vấn mô hình tối ưu</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="franchise-premises" className={styles.label}>
              Hiện trạng mặt bằng
            </label>
            <input
              id="franchise-premises"
              type="text"
              placeholder="Đã có mặt bằng 120m² / Đang tìm kiếm"
              value={premises}
              onChange={(e) => setPremises(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="franchise-notes" className={styles.label}>
            Nội dung trao đổi thêm
          </label>
          <textarea
            id="franchise-notes"
            rows={3}
            placeholder="Nhu cầu về ngân sách dự kiến, thời gian mong muốn khai trương, câu hỏi cụ thể..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Đang gửi thông tin...' : 'Gửi đăng ký nhượng quyền'}
          </Button>
          {zaloUrl ? (
            <Button href={zaloUrl} variant="outline" target="_blank" rel="noopener noreferrer">
              Trao đổi nhanh qua Zalo
            </Button>
          ) : null}
        </div>

        {status !== 'idle' && (
          <div
            id={feedbackId}
            role="status"
            aria-live="polite"
            className={`${styles.feedback} ${status === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}
          >
            {feedback}
          </div>
        )}
      </form>

      <div className={styles.directSupport}>
        Trực tiếp kết nối bộ phận phát triển dự án: {telHref ? <a href={telHref}>Hotline {COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline} (Hỗ trợ: {COMPANY_CONFIG.supportHours})
      </div>
    </div>
  );
}
