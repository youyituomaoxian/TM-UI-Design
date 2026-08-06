/*
 * Badge — vendored shadcn 风格（语义类 .badge + 状态变体）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'suc' | 'warn' | 'err' | 'run' | 'outline' | 'muted';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
  default: '',
  suc: 'badge-suc',
  warn: 'badge-warn',
  err: 'badge-err',
  run: 'badge-run',
  outline: 'badge-outline',
  muted: 'badge-muted'
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span ref={ref} className={cn('badge', variantClass[variant], className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { Badge };
