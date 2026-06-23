import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'light' | 'alt' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Section({
  children,
  variant = 'light',
  padding = 'md',
  className = '',
  style,
  ...props
}: SectionProps) {
  // Map variant to styling classes or inline base style
  let variantClass = '';
  const inlineStyle: React.CSSProperties = { ...style };

  if (variant === 'alt') {
    variantClass = 'section-alt';
  } else if (variant === 'dark') {
    inlineStyle.background = 'var(--web-navy)';
    inlineStyle.color = '#ffffff';
    inlineStyle.position = 'relative';
  } else {
    variantClass = 'section';
  }

  // Padding mapping
  let paddingStyle = '';
  switch (padding) {
    case 'none':
      paddingStyle = '0';
      break;
    case 'sm':
      paddingStyle = '40px 0';
      break;
    case 'lg':
      paddingStyle = '100px 0';
      break;
    case 'xl':
      paddingStyle = '120px 0';
      break;
    case 'md':
    default:
      paddingStyle = variant === 'alt' ? '' : '80px 0'; // use default css padding if alt
      break;
  }

  if (paddingStyle) {
    inlineStyle.padding = paddingStyle;
  }

  return (
    <section
      className={`${variantClass} ${className}`.trim()}
      style={inlineStyle}
      {...props}
    >
      {children}
    </section>
  );
}
