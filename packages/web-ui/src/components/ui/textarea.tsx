/*
 * Textarea — vendored shadcn 风格（语义类 .textarea，纯 CSS 变量）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('textarea', className)} {...props} />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
