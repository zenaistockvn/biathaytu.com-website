import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}

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
  // Map variant to existing web.css classes
  let variantClass = '';
  switch (variant) {
    case 'primary':
      variantClass = 'btn-primary';
      break;
    case 'outline':
      variantClass = 'btn-outline';
      break;
    case 'secondary':
      variantClass = 'btn-secondary'; // Assuming we might add this
      break;
    case 'ghost':
      variantClass = 'btn-ghost';
      break;
    default:
      variantClass = 'btn-primary';
  }

  // Size classes can be handled with inline style or new CSS classes.
  // For now, btn-primary and btn-outline have fixed padding in web.css (14px 32px), 
  // so we'll just append size modifiers if needed later.
  let sizeStyle = {};
  if (size === 'sm') {
    sizeStyle = { padding: '8px 16px', fontSize: '13px' };
  } else if (size === 'lg') {
    sizeStyle = { padding: '18px 40px', fontSize: '16px' };
  }

  const combinedClassName = `${variantClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClassName} style={sizeStyle} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} style={sizeStyle} {...props}>
      {children}
    </button>
  );
}
