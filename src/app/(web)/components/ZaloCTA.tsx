import React from 'react';

interface ZaloCTAProps {
  productId?: string;
  productName?: string;
  className?: string;
  label?: string;
  variant?: 'gold' | 'outline';
}

export default function ZaloCTA({ productName, className = '', label = 'Tư vấn & Đặt hàng qua Zalo', variant = 'gold' }: ZaloCTAProps) {
  const zaloPhone = '0915312166';
  const defaultMessage = productName 
    ? `Chào Bia Thầy Tu, mình cần tư vấn đặt hàng sản phẩm ${productName}`
    : `Chào Bia Thầy Tu, mình cần tư vấn đặt hàng bia Đức`;
    
  const zaloUrl = `https://zalo.me/${zaloPhone}?text=${encodeURIComponent(defaultMessage)}`;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '15px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.3px',
  };

  const goldStyle: React.CSSProperties = {
    ...baseStyle,
    background: 'linear-gradient(135deg, var(--web-gold) 0%, var(--web-gold-light) 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.25)',
    border: 'none',
  };

  const outlineStyle: React.CSSProperties = {
    ...baseStyle,
    background: 'transparent',
    color: 'var(--web-gold)',
    border: '2px solid var(--web-gold)',
    boxShadow: 'none',
  };

  return (
    <a 
      href={zaloUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={className}
      style={variant === 'outline' ? outlineStyle : goldStyle}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.03 2 11C2 13.06 2.84 14.96 4.23 16.51L3.08 19.86C3.02 20.04 3.07 20.24 3.2 20.37C3.33 20.5 3.53 20.54 3.71 20.48L7.33 19.31C8.75 19.76 10.33 20 12 20C17.52 20 22 15.97 22 11C22 6.03 17.52 2 12 2Z" fill="currentColor" opacity="0.9"/>
      </svg>
      {label}
    </a>
  );
}
