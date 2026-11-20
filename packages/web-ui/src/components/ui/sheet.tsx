/*
 * Sheet — vendored shadcn 风格抽屉（受控 .sheet-mask / .sheet / .sheet-<side> / .sheet-head）。
 * a11y: role=dialog + aria-modal；打开时聚焦；Escape 关闭；mask 点击关闭；面板点击不冒泡（合并用户 onClick）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  side?: SheetSide;
  onOpenChange?: (open: boolean) => void;
}

const sideClass: Record<SheetSide, string> = {
  left: 'sheet-left',
  right: 'sheet-right',
  top: 'sheet-top',
  bottom: 'sheet-bottom'
};

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, open = false, side = 'right', onOpenChange, onClick, children, ...props }, ref) => {
    const panelRef = React.useRef<HTMLDivElement | null>(null) as React.MutableRefObject<HTMLDivElement | null>;

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange?.(false);
      };
      document.addEventListener('keydown', onKey);
      panelRef.current?.focus();
      return () => document.removeEventListener('keydown', onKey);
    }, [open, onOpenChange]);

    if (!open) return null;
    return (
      <div className="sheet-mask" onClick={() => onOpenChange?.(false)}>
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            panelRef.current = node;
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn('sheet', sideClass[side], className)}
          onClick={(e) => {
            onClick?.(e);
            e.stopPropagation();
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
Sheet.displayName = 'Sheet';

export interface SheetHeadProps extends React.HTMLAttributes<HTMLDivElement> {}
const SheetHead = React.forwardRef<HTMLDivElement, SheetHeadProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('sheet-head', className)} {...props} />
));
SheetHead.displayName = 'SheetHead';

export { Sheet, SheetHead };