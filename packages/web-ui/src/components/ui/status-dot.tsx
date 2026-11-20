/*
 * StatusDot — 状态指示灯 / 状态点（弘讯B端适配）
 * contract: dot.size 10×10 HIGH；运行=--run(#16A34A) 独立于成功绿；
 * 机器状态语义（RULES §11.11，2026-08-05）：离线=dot-offline(n11)、停机=dot-off(n10)、待机=dot-idle(n9)；
 * 功能状态才用 ok(warning)/error。组件层与 CSS 类名一一对应。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatusDotStatus = 'running' | 'ok' | 'warning' | 'error' | 'idle' | 'off' | 'offline';

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusDotStatus;
  label?: React.ReactNode;
}

const statusClass: Record<StatusDotStatus, string> = {
  running: 'dot-run',
  ok: 'dot-ok',
  warning: 'dot-warn',
  error: 'dot-err',
  idle: 'dot-idle',
  off: 'dot-off',
  offline: 'dot-offline'
};

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status = 'running', label, children, ...props }, ref) => (
    <span ref={ref} className={cn('status-dot', className)} {...props}>
      <i className={statusClass[status]} aria-hidden />
      {label ?? children}
    </span>
  )
);
StatusDot.displayName = 'StatusDot';

export { StatusDot };
