'use client';

import { FormEvent, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { submitLead, trackContactEvent } from '@/lib/leadClient';

interface ProductConsultationFormProps {
  productName: string;
  productSlug?: string;
}

type SubmitState = 'idle' | 'submitting' | 'error';

const NEED_OPTIONS = [
  { value: 'mua lẻ', label: 'Mua lẻ' },
  { value: 'mua biếu tặng', label: 'Mua biếu tặng' },
  { value: 'nhà hàng quán bia', label: 'Nhà hàng / quán bia' },
  { value: 'sự kiện', label: 'Sự kiện' },
] as const;

export default function ProductConsultationForm({ productName, productSlug }: ProductConsultationFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [need, setNeed] = useState('');
  const [note, setNote] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting') return;

    setState('submitting');
    setErrorMessage('');

    try {
      await submitLead({
        formKind: 'product_consultation',
        name,
        phone,
        need,
        note,
        productName,
        productSlug,
        website,
      });

      trackContactEvent('lead_form_submit', {
        productSlug,
        formKind: 'product_consultation',
      });

      const message = [
        'Chào German Taste, tôi vừa gửi yêu cầu tư vấn trên website.',
        `Sản phẩm: ${productName}`,
        `Họ tên: ${name}`,
        `Số điện thoại: ${phone}`,
        `Nhu cầu: ${NEED_OPTIONS.find((item) => item.value === need)?.label || need}`,
        note ? `Ghi chú: ${note}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const zaloUrl = `${BRAND.socialLinks.zalo}?text=${encodeURIComponent(message)}`;
      trackContactEvent('contact_zalo_click', { productSlug });
      window.location.assign(zaloUrl);
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Không thể gửi thông tin lúc này.');
    }
  };

  const inputStyle = {
    minHeight: '46px',
    padding: '10px 12px',
    border: '1px solid var(--web-border)',
    borderRadius: '8px',
    background: '#fff',
    width: '100%',
  } as const;

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
          German Taste lưu thông tin để liên hệ tư vấn về {productName}. Sau khi gửi thành công, Zalo sẽ mở với nội dung đã điền sẵn.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span>Họ tên</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={inputStyle}
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
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span>Nhu cầu</span>
            <select
              name="need"
              required
              value={need}
              onChange={(event) => setNeed(event.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>Chọn nhu cầu tư vấn</option>
              {NEED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span>Ghi chú <span style={{ color: 'var(--web-text-muted)', fontSize: '12px' }}>(không bắt buộc)</span></span>
            <textarea
              name="note"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Số lượng dự kiến, thời gian cần hàng hoặc yêu cầu khác..."
              style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }}
            />
          </label>

          <label aria-hidden="true" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
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

          {errorMessage && (
            <p role="alert" style={{ margin: 0, color: '#8b2d2d', fontSize: '13px' }}>
              {errorMessage}
            </p>
          )}

          <div>
            <button type="submit" className="btn-primary shimmer-effect" disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Đang gửi...' : 'Gửi thông tin & mở Zalo'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
