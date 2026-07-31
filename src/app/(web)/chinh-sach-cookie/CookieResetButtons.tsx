'use client';

export default function CookieResetButtons() {
  const handleResetAge = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetAgeVerification'));
  };

  const handleResetCookie = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetCookieConsent'));
  };

  return (
    <div style={{ marginTop: '24px', padding: '20px', background: 'var(--web-bg-section)', borderRadius: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button
        onClick={handleResetAge}
        style={{
          background: '#fff',
          border: '1px solid var(--web-accent)',
          color: 'var(--web-accent-strong)',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Cài Đặt Lại Xác Nhận Độ Tuổi
      </button>

      <button
        onClick={handleResetCookie}
        style={{
          background: '#fff',
          border: '1px solid var(--web-ink)',
          color: 'var(--web-ink)',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Cài Đặt Lại Quyền Cookie
      </button>
    </div>
  );
}
