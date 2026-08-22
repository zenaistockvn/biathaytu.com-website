'use client';

import { FormEvent, useState } from 'react';
import { submitLead, trackContactEvent } from '@/lib/leadClient';
import styles from './WebFooter.module.css';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function FooterLeadForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting') return;

    setState('submitting');
    setMessage('');

    try {
      await submitLead({
        formKind: 'footer_price_list',
        name,
        phone,
        website,
        need: 'nhận bảng giá và thông tin sản phẩm',
      });
      trackContactEvent('lead_form_submit', { formKind: 'footer_price_list' });
      setName('');
      setPhone('');
      setWebsite('');
      setState('success');
      setMessage('Đã nhận thông tin. German Taste sẽ liên hệ với bạn sớm.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Không thể gửi thông tin lúc này.');
    }
  };

  return (
    <section className={styles.leadPanel} aria-labelledby="footer-lead-title">
      <div className={styles.leadIntro}>
        <span className={styles.leadEyebrow}>German Taste</span>
        <h3 id="footer-lead-title" className={styles.leadTitle}>Nhận bảng giá và thông tin sản phẩm</h3>
        <p className={styles.leadDescription}>
          Để lại thông tin, đội ngũ German Taste sẽ tư vấn sản phẩm phù hợp và gửi bảng giá niêm yết.
        </p>
      </div>

      <form className={styles.leadForm} onSubmit={handleSubmit}>
        <div className={styles.leadFields}>
          <label className={styles.leadField}>
            <span>Họ tên</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </label>
          <label className={styles.leadField}>
            <span>Số điện thoại</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="09xx xxx xxx"
            />
          </label>
        </div>

        <label className={styles.honeypot} aria-hidden="true">
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>

        <button className={styles.leadButton} type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Đang gửi...' : 'Nhận thông tin'}
        </button>

        {message && (
          <p className={state === 'success' ? styles.leadSuccess : styles.leadError} role="status">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
