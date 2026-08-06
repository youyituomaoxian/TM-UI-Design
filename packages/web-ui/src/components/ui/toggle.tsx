/*
 * Toggle — vendored shadcn 风格（.toggle，受控/非受控）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, defaultPressed, onPressedChange, onClick, children, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(!!defaultPressed);
    const isControlled = pressed !== undefined;
    const value = isControlled ? pressed : internal;
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={value}
        data-on={value ? 'true' : 'false'}
        className={cn('toggle', className)}
        onClick={(e) => {
          onClick?.(e);
          const next = !value;
          if (!isControlled) setInternal(next);
          onPressedChange?.(next);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Toggle.displayName = 'Toggle';

export { Toggle };
