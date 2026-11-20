/*
 * Tooltip — vendored shadcn 风格（语义类 .tooltip / .tooltip-content，hover 显示）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content?: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, ...props }, ref) => (
    <div ref={ref} className={cn('tooltip', className)} {...props}>
      {children}
      {content != null && <span className="tooltip-content">{content}</span>}
    </div>
  )
);
Tooltip.displayName = 'Tooltip';

export { Tooltip };
