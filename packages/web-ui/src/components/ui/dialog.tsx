/*
 * Dialog / Modal — vendored shadcn 风格（弘讯B端适配，radix-free 离线实现）
 * 382×257 / 圆角8 / 头40 / elevation overlay 双层投影 / 遮罩半透明黑。
 * a11y: role=dialog + aria-modal；打开时聚焦面板；Escape 关闭；mask 点击关闭。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, title, children, footer, onClose, className }) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={cn('modal-mask', open && 'show')}
      onClick={e => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div ref={panelRef} className={cn('modal', className)} role="dialog" aria-modal="true" tabIndex={-1}>
        {title !== undefined && <div className="modal-head">{title}</div>}
        <div className="modal-body">{children}</div>
        {footer !== undefined && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

export { Dialog };
