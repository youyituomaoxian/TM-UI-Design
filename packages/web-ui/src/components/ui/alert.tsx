/*
 * Alert — vendored shadcn 风格（语义类 .alert + 状态变体 / .alert-title / .alert-desc / .alert-icon）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type AlertVariant = 'suc' | 'warn' | 'err' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const variantClass: Record<AlertVariant, string> = {
  suc: 'alert-suc',
  warn: 'alert-warn',
  err: 'alert-err',
  info: 'alert-info'
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', children, ...props }, ref) => (
    <div ref={ref} className={cn('alert', variantClass[variant], className)} {...props}>
      {children}
    </div>
  )
);
Alert.displayName = 'Alert';

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('alert-title', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

export interface AlertDescProps extends React.HTMLAttributes<HTMLDivElement> {}
const AlertDesc = React.forwardRef<HTMLDivElement, AlertDescProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('alert-desc', className)} {...props} />
));
AlertDesc.displayName = 'AlertDesc';

export interface AlertIconProps extends React.HTMLAttributes<HTMLSpanElement> {}
const AlertIcon = React.forwardRef<HTMLSpanElement, AlertIconProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('alert-icon', className)} {...props} />
));
AlertIcon.displayName = 'AlertIcon';

export { Alert, AlertTitle, AlertDesc, AlertIcon };
