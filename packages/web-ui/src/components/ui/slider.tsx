/*
 * Slider — vendored shadcn 风格（input[type=range].slider）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue = 0, min = 0, max = 100, step = 1, onValueChange, onChange, ...props }, ref) => {
    const [internal, setInternal] = React.useState<number>(defaultValue);
    const current = value !== undefined ? value : internal;
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => {
          onChange?.(e);
          const next = Number(e.target.value);
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        className={cn('slider', className)}
        {...props}
      />
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
