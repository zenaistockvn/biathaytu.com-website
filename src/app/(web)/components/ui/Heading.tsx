import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  color?: 'navy' | 'gold' | 'white' | 'gold-dark' | 'inherit';
}

export default function Heading({
  level = 2,
  children,
  className = '',
  size,
  color = 'inherit',
  style,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const inlineStyle: React.CSSProperties = { ...style };

  // Set font size based on size token or level
  if (size === 'fluid') {
    inlineStyle.fontSize = 'clamp(28px, 5vw, 48px)';
    inlineStyle.lineHeight = '1.2';
  } else if (size === 'xl') {
    inlineStyle.fontSize = 'clamp(32px, 5vw, 52px)';
    inlineStyle.lineHeight = '1.25';
  } else if (size === 'lg') {
    inlineStyle.fontSize = '28px';
  } else if (size === 'md') {
    inlineStyle.fontSize = '24px';
  } else if (size === 'sm') {
    inlineStyle.fontSize = '18px';
  }

  // Set color mapping
  if (color === 'navy') {
    inlineStyle.color = 'var(--web-navy)';
  } else if (color === 'gold') {
    inlineStyle.color = 'var(--web-gold)';
  } else if (color === 'gold-dark') {
    inlineStyle.color = 'var(--web-gold-dark)';
  } else if (color === 'white') {
    inlineStyle.color = '#ffffff';
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
