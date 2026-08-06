/*
 * Pagination / Pager — vendored shadcn 风格（弘讯B端适配）
 * contract: pager.btn 24×24 HIGH · 半径999 HIGH · 字12 MEDIUM；激活 primary 实底。
 * 页码窗口化：cur±2 + 首末页 + 省略号；prev/next 边界禁态；total=0 不渲染激活页码。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  total: number;
  pageSize?: number;
  current?: number;
  defaultCurrent?: number;
  onChange?: (page: number) => void;
  className?: string;
}

const pageNumbers = (pages: number, cur: number): (number | '…')[] => {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, i) => i + 1);
  }
  const out: (number | '…')[] = [1];
  const lo = Math.max(2, cur - 2);
  const hi = Math.min(pages - 1, cur + 2);
  if (lo > 2) out.push('…');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < pages - 1) out.push('…');
  out.push(pages);
  return out;
};

const Pagination: React.FC<PaginationProps> = ({ total, pageSize = 10, current, defaultCurrent = 1, onChange, className }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const [inner, setInner] = React.useState(defaultCurrent);
  const cur = Math.min(pages, Math.max(1, current !== undefined ? current : inner));
  const go = (p: number) => {
    const next = Math.min(pages, Math.max(1, p));
    if (next === cur) return;
    setInner(next);
    onChange?.(next);
  };
  const canPrev = cur > 1;
  const canNext = cur < pages;
  return (
    <div className={cn('pager', className)}>
      <span
        className={cn('pg', !canPrev && 'disabled')}
        aria-disabled={!canPrev}
        onClick={() => canPrev && go(cur - 1)}
      >‹</span>
      {total > 0 &&
        pageNumbers(pages, cur).map((p, idx) =>
          p === '…' ? (
            <span key={`e${idx}`} className="pg-ellipsis">…</span>
          ) : (
            <span key={p} className={cn('pg', p === cur && 'active')} onClick={() => go(p)}>
              {p}
            </span>
          )
        )}
      <span
        className={cn('pg', !canNext && 'disabled')}
        aria-disabled={!canNext}
        onClick={() => canNext && go(cur + 1)}
      >›</span>
      <span className="pg-tot">共 {total} 条</span>
    </div>
  );
};

export { Pagination };
