/*
 * Input — vendored shadcn 风格（弘讯B端适配）
 * contract: input.size 高32 HIGH · 半径4 HIGH；N5底 N6边，focus 主色描边。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn('input', className)} {...props} />
  )
);
Input.displayName = 'Input';

export { Input };
