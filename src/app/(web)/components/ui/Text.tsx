import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'li' | 'strong';
  children: React.ReactNode;
  className?: string;
  /** Tên theo vai trò, không theo màu: palette đổi thì chỗ gọi vẫn đúng. */
  color?: 'main' | 'secondary' | 'muted' | 'accent' | 'ink' | 'on-ink' | 'on-ink-accent' | 'inherit';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | number;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  letterSpacing?: string;
}

export default function Text({
  as = 'p',
  children,
  className = '',
  color = 'inherit',
  size,
  weight,
  transform,
  letterSpacing,
  style,
  ...props
}: TextProps) {
  const Tag = as as 'p' | 'span' | 'div' | 'li' | 'strong';

  const inlineStyle: React.CSSProperties = { ...style };

  // Color Mapping. on-ink* chỉ dùng trên dải tối (--web-ink / --web-sky).
  if (color === 'main') {
    inlineStyle.color = 'var(--web-text)';
  } else if (color === 'secondary') {
    inlineStyle.color = 'var(--web-text-secondary)';
  } else if (color === 'muted') {
    inlineStyle.color = 'var(--web-text-muted)';
  } else if (color === 'accent') {
    inlineStyle.color = 'var(--web-accent)';
  } else if (color === 'ink') {
    inlineStyle.color = 'var(--web-ink)';
  } else if (color === 'on-ink') {
    inlineStyle.color = 'var(--web-on-ink)';
  } else if (color === 'on-ink-accent') {
    inlineStyle.color = 'var(--web-accent-on-ink)';
  }

  // Size Mapping
  if (size === 'xs') {
    inlineStyle.fontSize = '13px';
  } else if (size === 'sm') {
    inlineStyle.fontSize = '14px';
  } else if (size === 'md') {
    inlineStyle.fontSize = '16px';
  } else if (size === 'lg') {
    inlineStyle.fontSize = '18px';
  } else if (size === 'xl') {
    inlineStyle.fontSize = '20px';
  }

  // Weight Mapping
  if (weight) {
    if (typeof weight === 'number') {
      inlineStyle.fontWeight = weight;
    } else {
      switch (weight) {
        case 'normal':
          inlineStyle.fontWeight = 400;
          break;
        case 'medium':
          inlineStyle.fontWeight = 500;
          break;
        case 'semibold':
          inlineStyle.fontWeight = 600;
          break;
        case 'bold':
          inlineStyle.fontWeight = 700;
          break;
      }
    }
  }

  // Text Transform
  if (transform && transform !== 'none') {
    inlineStyle.textTransform = transform;
  }

  // Letter Spacing
  if (letterSpacing) {
    inlineStyle.letterSpacing = letterSpacing;
  }

  return (
    <Tag
      className={className}
      style={inlineStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}
