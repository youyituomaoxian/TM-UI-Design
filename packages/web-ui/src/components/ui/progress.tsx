/*
 * Progress — vendored shadcn 风格（语义类 .progress / .progress-bar）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, style, ...props }, ref) => {
    const pct = !Number.isFinite(value) || max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div
        ref={ref}
        className={cn('progress', className)}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div className="progress-bar" style={{ width: `${pct}%`, ...style }} />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
