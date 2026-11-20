/*
 * Label — vendored shadcn 风格（语义类 .label / .label-req）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label ref={ref} className={cn('label', required && 'label-req', className)} {...props}>
      {children}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
