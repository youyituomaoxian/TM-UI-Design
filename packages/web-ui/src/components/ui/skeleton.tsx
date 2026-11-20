/*
 * Skeleton — vendored shadcn 风格（语义类 .skeleton / .skeleton.pulse）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  pulse?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, pulse, ...props }, ref) => (
    <div ref={ref} className={cn('skeleton', pulse && 'pulse', className)} {...props} />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
