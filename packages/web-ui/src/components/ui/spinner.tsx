/*
 * Spinner — vendored shadcn 风格（语义类 .spinner，@keyframes spin）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('spinner', className)} role="status" aria-label="loading" {...props} />
  )
);
Spinner.displayName = 'Spinner';

export { Spinner };
