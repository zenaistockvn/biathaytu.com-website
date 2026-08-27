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
          backgroundColor: '#0d1117',
          color: '#f1c40f',
          borderTop: '2px solid #f39c12',
          borderBottom: '2px solid #f39c12',
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
          backgroundColor: '#fff9e6',
          borderLeft: '4px solid #d97706',
          color: '#78350f',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '1.5',
          margin: '16px 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          ...style,
        }}
        role="alert"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '16px', lineHeight: '1' }}></span>
          <div>
            <strong style={{ display: 'block', color: '#92400e', marginBottom: '2px' }}>
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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(243, 156, 18, 0.15)',
          border: '1px solid rgba(243, 156, 18, 0.3)',
          color: '#f39c12',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          lineHeight: '1.4',
          ...style,
        }}
      >
        <span style={{
          backgroundColor: '#f39c12',
          color: '#000',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '11px',
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
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        color: '#e6edf3',
        padding: '8px 12px',
        borderRadius: '6px',
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
      <span style={{ color: '#e3b341', fontSize: '14px' }}></span>
      <span>{text}</span>
    </div>
  );
}
