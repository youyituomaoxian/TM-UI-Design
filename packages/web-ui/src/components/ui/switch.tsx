/*
 * Switch — vendored shadcn 风格（.switch + .switch-thumb，受控/非受控）。
 * a11y: role=switch 落在可聚焦 div（tabIndex 0 / -1），Enter/Space 切换；禁用态渲染 data-disabled。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, onClick, onKeyDown, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(!!defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;
    const toggle = () => {
      if (disabled) return;
      const next = !value;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };
    return (
      <div
        ref={ref}
        role="switch"
        aria-checked={value}
        aria-disabled={disabled}
        data-on={value ? 'true' : 'false'}
        data-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : 0}
        className={cn('switch', className)}
        onClick={(e) => {
          onClick?.(e);
          toggle();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        {...props}
      >
        <span className="switch-thumb" />
      </div>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
