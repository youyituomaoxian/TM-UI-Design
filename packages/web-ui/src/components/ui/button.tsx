/*
 * Button — vendored shadcn 风格（弘讯B端适配）
 * contract: button.radius r8 HIGH · button.weight 400 HIGH · button.height 24/32/40 MEDIUM
 * 类名走 components.css .btn 系（与 components.json contract 选择器 1:1）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  text: 'btn-text'
};
const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  default: '',
  lg: 'btn-lg'
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('btn', variantClass[variant], sizeClass[size], className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button };
