import React from 'react';
import Link from 'next/link';

type CommonProps = {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
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

  // Size classes
  let sizeClass = '';
  if (size === 'sm') {
    sizeClass = 'btn-sm';
  } else if (size === 'lg') {
    sizeClass = 'btn-lg';
  }

  const combinedClassName = `${variantClass} ${sizeClass} ${className}`.trim();

  if (href) {
    // Safely cast props to Anchor attributes when href is present
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} {...anchorProps} className={combinedClassName} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  // Safely cast props to Button attributes when href is absent
  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} className={combinedClassName}>
      {children}
    </button>
  );
}
