import React from 'react';
import Link from 'next/link';

/**
 * Nút chữ nhật kiểu Chimay (xem DESIGN.md).
 * - primary: xanh trời, hành động chính trên nền sáng (trên dải tối tự đổi sang vàng nhãn)
 * - dark: xanh đêm, tương ứng nút đen của Chimay
 * - light: nền trắng, đặt trên khối màu hoặc ảnh
 * - outline: viền xanh trời
 * - link: chữ in hoa kèm mũi tên, cho "Xem tất cả" cuối section
 */
type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'link' | 'secondary' | 'ghost';

type CommonProps = {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
};

interface ButtonAsButtonProps extends CommonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never;
  target?: never;
  rel?: never;
}

interface ButtonAsLinkProps extends CommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  light: 'btn-light',
  outline: 'btn-outline',
  link: 'btn-link',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const combinedClassName = `${VARIANT_CLASS[variant]} ${sizeClass} ${className}`.replace(/\s+/g, ' ').trim();
  const content = variant === 'link' ? <>{children}<Arrow /></> : children;

  if (href) {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} {...anchorProps} className={combinedClassName} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} className={combinedClassName}>
      {content}
    </button>
  );
}
