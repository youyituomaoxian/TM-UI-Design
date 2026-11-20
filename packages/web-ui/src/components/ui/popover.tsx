/*
 * Popover — vendored shadcn 风格（语义类 .popover / .popover-trigger / .popover-content）。
 * open 状态经 Context 下发；Trigger/Content 兼收 cloneElement 注入（向后兼容，白名单）；
 * 外部点击 / Escape 关闭。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const PopoverContext = React.createContext<PopoverContextValue>({ open: false, setOpen: () => {} });

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, open: controlled, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(defaultOpen);
    const open = controlled !== undefined ? controlled : internal;
    const rootRef = React.useRef<HTMLDivElement | null>(null) as React.MutableRefObject<HTMLDivElement | null>;
    const setOpen = (v: boolean) => {
      setInternal(v);
      onOpenChange?.(v);
    };

    React.useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    return (
      <PopoverContext.Provider value={{ open, setOpen }}>
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            rootRef.current = node;
          }}
          className={cn('popover', className)}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            const t = (child.type as { displayName?: string })?.displayName;
            if (t === 'PopoverTrigger' || t === 'PopoverContent') {
              return React.cloneElement(child as React.ReactElement<{ open?: boolean; setOpen?: (v: boolean) => void }>, {
                open,
                setOpen
              });
            }
            return child;
          })}
        </div>
      </PopoverContext.Provider>
    );
  }
);
Popover.displayName = 'Popover';

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
  setOpen?: (v: boolean) => void;
}
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, open, setOpen, onClick, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext);
    const isOpen = open ?? ctx.open;
    const change = setOpen ?? ctx.setOpen;
    return (
      <button
        ref={ref}
        type="button"
        className={cn('popover-trigger', className)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={(e) => {
          onClick?.(e);
          change(!isOpen);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  setOpen?: (v: boolean) => void;
}
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, open, setOpen: _setOpen, children, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext);
    if (!(open ?? ctx.open)) return null;
    return (
      <div ref={ref} className={cn('popover-content', className)} {...props}>
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
