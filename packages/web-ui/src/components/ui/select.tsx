/*
 * Select / Dropdown — vendored shadcn 风格（弘讯B端适配，radix-free 离线实现）
 * 触发器同输入（h32 r4 N5底）；浮层 elevation overlay（r8 双层投影）。
 * a11y: 触发器 tabIndex 0 + Enter/Space 切换；面板方向键导航 / Enter 选中 / Escape 关闭；disabled 选项带 .is-disabled。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, defaultValue, placeholder = '请选择', disabled, onChange, className }) => {
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value !== undefined ? value : inner;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const pick = (o: SelectOption) => {
    if (o.disabled) return;
    setInner(o.value);
    onChange?.(o.value);
    setOpen(false);
  };

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  React.useEffect(() => {
    if (open) setActiveIdx(0);
  }, [open]);

  const current = options.find(o => o.value === val);

  return (
    <div ref={rootRef} className={cn('sel', open && 'open', className)}>
      <div
        ref={triggerRef}
        className="sel-trigger"
        role="combobox"
        aria-expanded={open}
        aria-disabled={disabled}
        data-disabled={disabled ? 'true' : undefined}
        aria-controls={open ? 'sel-panel' : undefined}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (!open) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
            return;
          }
          const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0);
          if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const cur = enabled.indexOf(activeIdx);
            const next = enabled[(cur + 1) % enabled.length];
            if (next !== undefined) setActiveIdx(next);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const cur = enabled.indexOf(activeIdx);
            const next = enabled[(cur - 1 + enabled.length) % enabled.length];
            if (next !== undefined) setActiveIdx(next);
          } else if (e.key === 'Home') {
            e.preventDefault();
            if (enabled[0] !== undefined) setActiveIdx(enabled[0]);
          } else if (e.key === 'End') {
            e.preventDefault();
            if (enabled[enabled.length - 1] !== undefined) setActiveIdx(enabled[enabled.length - 1]);
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const target = options[activeIdx];
            if (target) pick(target);
          } else if (e.key === 'Tab') {
            setOpen(false);
          }
        }}
      >
        <span>{current ? current.label : placeholder}</span>
        <span aria-hidden style={{ color: 'var(--n9)' }}>▾</span>
      </div>
      {open && (
        <div id="sel-panel" className="sel-panel" role="listbox" aria-activedescendant={options[activeIdx] ? `sel-opt-${options[activeIdx].value}` : undefined}>
          {options.map((o, i) => (
            <div
              key={o.value}
              id={`sel-opt-${o.value}`}
              role="option"
              aria-selected={o.value === val}
              aria-disabled={o.disabled}
              className={cn('sel-opt', o.value === val && 'on', o.disabled && 'is-disabled', i === activeIdx && open && 'focused')}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => pick(o)}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { Select };
