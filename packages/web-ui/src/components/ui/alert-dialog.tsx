/*
 * AlertDialog — vendored shadcn 风格（受控 .alert-dialog-mask / .alert-dialog / .alert-dialog-head / .alert-dialog-body / .alert-dialog-foot）。
 * a11y: role=dialog + aria-modal；打开时聚焦面板；Escape 关闭；mask 点击关闭；面板点击不冒泡（合并用户 onClick）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AlertDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ className, open = false, onOpenChange, onClick, children, ...props }, ref) => {
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
      <div className="alert-dialog-mask" onClick={() => onOpenChange?.(false)}>
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            panelRef.current = node;
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn('alert-dialog', className)}
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
AlertDialog.displayName = 'AlertDialog';

export interface AlertDialogHeadProps extends React.HTMLAttributes<HTMLDivElement> {}
const AlertDialogHead = React.forwardRef<HTMLDivElement, AlertDialogHeadProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('alert-dialog-head', className)} {...props} />
));
AlertDialogHead.displayName = 'AlertDialogHead';

export interface AlertDialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
const AlertDialogBody = React.forwardRef<HTMLDivElement, AlertDialogBodyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('alert-dialog-body', className)} {...props} />
));
AlertDialogBody.displayName = 'AlertDialogBody';

export interface AlertDialogFootProps extends React.HTMLAttributes<HTMLDivElement> {}
const AlertDialogFoot = React.forwardRef<HTMLDivElement, AlertDialogFootProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('alert-dialog-foot', className)} {...props} />
));
AlertDialogFoot.displayName = 'AlertDialogFoot';

export { AlertDialog, AlertDialogHead, AlertDialogBody, AlertDialogFoot };