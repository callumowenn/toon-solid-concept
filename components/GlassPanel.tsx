'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

/** Frosted panel: 70% white + blur(24px). Inline styles beat cascade issues. */
export default function GlassPanel({
  as: Tag = 'div',
  children,
  className = '',
  style,
  ...rest
}: Props) {
  return (
    <Tag
      className={className}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(20, 28, 40, 0.1)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
