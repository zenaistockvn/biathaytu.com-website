'use client';
import { useToastStore } from '@/stores/useToastStore';

export default function Toast() {
  const { message, visible, hide } = useToastStore();

  if (!visible) return null;

  return (
    <div
      className="toast-container"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="toast-item"
        data-surface="ink"
        style={{
          background: 'var(--web-ink)',
          color: 'var(--web-on-ink)',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgb(var(--web-ink-rgb) / 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontWeight: 500,
          fontSize: '15px',
        }}
      >
        <span>{message}</span>
        <button
          onClick={hide}
          aria-label="Đóng thông báo"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--web-on-ink-muted)',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: 'auto',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>
  );
}
