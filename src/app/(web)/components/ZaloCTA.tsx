import React from 'react';
import { BRAND } from '@/lib/brand';

interface ZaloCTAProps {
  productId?: string;
  productName?: string;
  className?: string;
  label?: string;
  variant?: 'gold' | 'outline';
}

export function getZaloProductUrl(productName?: string) {
  const message = productName
    ? `Chào German Taste, tôi muốn đặt sản phẩm ${productName}. Vui lòng tư vấn giúp tôi.`
    : 'Chào German Taste, tôi muốn được tư vấn về các sản phẩm Benediktiner.';

  return `${BRAND.socialLinks.zalo}?text=${encodeURIComponent(message)}`;
}

export default function ZaloCTA({ productName, className = '', label = 'Đặt qua Zalo', variant = 'gold' }: ZaloCTAProps) {
  const zaloUrl = getZaloProductUrl(productName);
  const variantClass = variant === 'outline' ? 'zalo-cta-outline-class' : 'zalo-cta-gold-class';
  const combinedClassName = `zalo-cta-class ${variantClass} ${className}`.trim();

  return (
    <a
      href={zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={combinedClassName}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.03 2 11C2 13.06 2.84 14.96 4.23 16.51L3.08 19.86C3.02 20.04 3.07 20.24 3.2 20.37C3.33 20.5 3.53 20.54 3.71 20.48L7.33 19.31C8.75 19.76 10.33 20 12 20C17.52 20 22 15.97 22 11C22 6.03 17.52 2 12 2Z" fill="currentColor" opacity="0.9"/>
      </svg>
      {label}
    </a>
  );
}
