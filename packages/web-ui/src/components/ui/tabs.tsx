/*
 * Tabs — vendored shadcn 风格（弘讯B端适配，radix-free 离线实现）
 * contract: tabs.size 高32 HIGH · 字13 MEDIUM；激活 primary + 2px 下划线 + 字重500 HIGH。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ items, activeKey, defaultActiveKey, onChange, className }) => {
  const [inner, setInner] = React.useState(defaultActiveKey ?? items[0]?.key);
  const active = activeKey !== undefined ? activeKey : inner;
  const enabledKeys = items.filter(it => !it.disabled).map(it => it.key);

  const moveFocus = (dir: 1 | -1) => {
    const idx = enabledKeys.indexOf(active);
    const next = enabledKeys[(idx + dir + enabledKeys.length) % enabledKeys.length];
    if (next !== undefined) setInner(next);
  };

  return (
    <div className={cn('tabs', className)} role="tablist" aria-label="页签">
      {items.map(it => (
        <div
          key={it.key}
          role="tab"
          aria-selected={active === it.key}
          aria-disabled={it.disabled}
          tabIndex={active === it.key ? 0 : -1}
          className={cn('tab', active === it.key && 'active', it.disabled && 'is-disabled')}
          onClick={() => {
            if (it.disabled) return;
            setInner(it.key);
            onChange?.(it.key);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              moveFocus(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              moveFocus(-1);
            } else if (e.key === 'Home') {
              e.preventDefault();
              if (enabledKeys[0]) setInner(enabledKeys[0]);
            } else if (e.key === 'End') {
              e.preventDefault();
              if (enabledKeys[enabledKeys.length - 1]) setInner(enabledKeys[enabledKeys.length - 1]);
            }
          }}
        >
          {it.label}
        </div>
      ))}
    </div>
  );
};

export { Tabs };
