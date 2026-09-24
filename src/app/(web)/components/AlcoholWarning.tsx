'use client';

import React from 'react';
import { DEFAULT_ALCOHOL_WARNING } from '@/constants/compliance';

interface AlcoholWarningProps {
  variant?: 'banner' | 'footer' | 'checkout' | 'inline' | 'product';
  customText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AlcoholWarning({
  variant = 'inline',
  customText,
  className = '',
  style,
}: AlcoholWarningProps) {
  const text = customText || DEFAULT_ALCOHOL_WARNING;

  if (variant === 'banner') {
    return (
      <div
        className={`alcohol-warning-banner ${className}`}
        style={{
          width: '100%',
          minHeight: '10%',
          backgroundColor: 'var(--web-ink-deep)',
          color: 'var(--web-accent-on-ink)',
          borderTop: '2px solid var(--web-accent-on-ink)',
          borderBottom: '2px solid var(--web-accent-on-ink)',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: '600',
          lineHeight: '1.4',
          textAlign: 'center',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 10,
          ...style,
        }}
        role="alert"
        aria-label="Cảnh báo đồ uống có cồn"
      >
        <span style={{ fontSize: '16px' }}></span>
        <span>{text}</span>
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div
        className={`alcohol-warning-checkout ${className}`}
        style={{
          backgroundColor: 'var(--web-bg-section)',
          borderLeft: '4px solid var(--web-heritage)',
          color: 'var(--web-ink)',
          padding: '12px 16px',
          fontSize: '13px',
          fontWeight: '600',
          lineHeight: '1.5',
          margin: '16px 0',
          ...style,
        }}
        role="alert"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '16px', lineHeight: '1' }}></span>
          <div>
            <strong style={{ display: 'block', color: 'var(--web-ink)', marginBottom: '2px' }}>
              Cảnh báo tuân thủ quy định bán bia lẻ:
            </strong>
            <span>{text}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`alcohol-warning-footer ${className}`}
        style={{
          // Màu kế thừa từ khối chứa (thanh vàng của footer), chỉ có nhãn 18+ là khối màu riêng.
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'inherit',
          fontSize: '13px',
          fontWeight: '600',
          lineHeight: '1.4',
          ...style,
        }}
      >
        <span style={{
          backgroundColor: 'var(--web-ink)',
          color: 'var(--web-accent-on-ink)',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          flexShrink: 0
        }}>
          18+
        </span>
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div
      className={`alcohol-warning-inline ${className}`}
      style={{
        backgroundColor: 'var(--web-ink-deep)',
        border: '1px solid rgb(var(--web-on-ink-rgb) / 0.15)',
        color: 'var(--web-on-ink-muted)',
        padding: '8px 12px',
        fontSize: '12px',
        lineHeight: '1.4',
        margin: '8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style,
      }}
      role="note"
    >
      <span style={{ color: 'var(--web-accent-on-ink)', fontSize: '14px' }}></span>
      <span>{text}</span>
    </div>
  );
}
