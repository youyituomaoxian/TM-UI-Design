/*
 * Checkbox — vendored shadcn 风格（input.checkbox + .checkbox-wrap）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} type="checkbox" className={cn('checkbox', className)} {...props} />
  )
);
Checkbox.displayName = 'Checkbox';

export interface CheckboxWrapProps extends React.HTMLAttributes<HTMLLabelElement> {
  label?: React.ReactNode;
}

const CheckboxWrap = React.forwardRef<HTMLLabelElement, CheckboxWrapProps>(
  ({ className, label, children, ...props }, ref) => (
    <label ref={ref} className={cn('checkbox-wrap', className)} {...props}>
      {children}
      {label}
    </label>
  )
);
CheckboxWrap.displayName = 'CheckboxWrap';

export { Checkbox, CheckboxWrap };
