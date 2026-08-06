/*
 * DatePicker — vendored shadcn 风格（弘讯B端适配，radix-free 离线实现）
 * 触发器同输入（h32 r4 N5底）；W1 默认态=触发器 + 原生 input[type=date] 隐藏承接。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, defaultValue, onChange, className, placeholder = '选择日期' }) => {
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const val = value !== undefined ? value : inner;
  const nativeRef = React.useRef<HTMLInputElement>(null);

  const openNative = () => {
    const el = nativeRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
    } else {
      // Safari <16.4 / 部分 webview 无 showPicker：降级为原生 click 打开日历
      el.click();
    }
  };

  return (
    <div className={cn('dp', className)}>
      <div
        className="dp-trigger"
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        onClick={openNative}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openNative();
          }
        }}
      >
        <span>{val || placeholder}</span>
        <span aria-hidden style={{ color: 'var(--n9)' }}>📅</span>
      </div>
      <input
        ref={nativeRef}
        type="date"
        value={val}
        onChange={e => {
          setInner(e.target.value);
          onChange?.(e.target.value);
        }}
        style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
};

export { DatePicker };
