import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export default function Container({
  children,
  className = '',
  maxWidth,
  style,
  ...props
}: ContainerProps) {
  const combinedStyle = {
    ...(maxWidth ? { maxWidth } : {}),
    ...style,
  };

  return (
    <div
      className={`container ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}
