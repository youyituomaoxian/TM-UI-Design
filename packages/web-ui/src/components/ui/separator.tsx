/*
 * Separator — vendored shadcn 风格（语义类 .separator / .separator-v）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(orientation === 'vertical' ? 'separator-v' : 'separator', className)}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };
