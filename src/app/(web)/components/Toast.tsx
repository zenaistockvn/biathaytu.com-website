'use client';
import { useToastStore } from '@/stores/useToastStore';
import Link from 'next/link';

export default function Toast() {
  const { message, visible, hide } = useToastStore();

  if (!visible) return null;

  return (
    <div className="toast-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease',
    }}>
      <div className="toast-item" style={{
        background: 'var(--web-navy)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontWeight: 500,
        fontSize: '15px'
      }}>
        <span>{message}</span>
        <Link 
          href="/dat-hang" 
          onClick={hide}
          style={{
            color: 'var(--web-primary)',
            textDecoration: 'underline',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Xem giỏ hàng →
        </Link>
        <button 
          onClick={hide}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '8px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
