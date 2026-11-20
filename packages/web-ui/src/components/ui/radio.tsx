/*
 * Radio / RadioGroup — vendored shadcn 风格（input.radio + .radio-group）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} type="radio" className={cn('radio', className)} {...props} />
  )
);
Radio.displayName = 'Radio';

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('radio-group', className)} {...props} />
  )
);
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };
