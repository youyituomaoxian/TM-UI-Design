/*
 * DropdownMenu — vendored shadcn 风格（语义类 .dropdown / .dropdown-trigger / .dropdown-content / .dropdown-item / .dropdown-sep）。
 * open 状态经 Context 下发（任意深度可读），Trigger/Content 兼收 cloneElement 注入（向后兼容）；
 * 注入白名单：仅 DropdownTrigger/DropdownContent（避免 open/setOpen 泄漏到 Item/Sep/自定义元素）。
 * 外部点击 / Escape 关闭；DropdownItem onSelect 后自动关闭。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const DropdownContext = React.createContext<DropdownContextValue>({ open: false, setOpen: () => {} });

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
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
      <DropdownContext.Provider value={{ open, setOpen }}>
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            rootRef.current = node;
          }}
          className={cn('dropdown', className)}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            const t = (child.type as { displayName?: string })?.displayName;
            if (t === 'DropdownTrigger' || t === 'DropdownContent') {
              return React.cloneElement(child as React.ReactElement<{ open?: boolean; setOpen?: (v: boolean) => void }>, {
                open,
                setOpen
              });
            }
            return child;
          })}
        </div>
      </DropdownContext.Provider>
    );
  }
);
DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
  setOpen?: (v: boolean) => void;
}
const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, open, setOpen, onClick, children, ...props }, ref) => {
    const ctx = React.useContext(DropdownContext);
    const isOpen = open ?? ctx.open;
    const change = setOpen ?? ctx.setOpen;
    return (
      <button
        ref={ref}
        type="button"
        className={cn('dropdown-trigger', className)}
        aria-haspopup="menu"
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
DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  setOpen?: (v: boolean) => void;
}
const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ className, open, setOpen: _setOpen, children, ...props }, ref) => {
    const ctx = React.useContext(DropdownContext);
    if (!(open ?? ctx.open)) return null;
    return (
      <div ref={ref} className={cn('dropdown-content', className)} {...props}>
        {children}
      </div>
    );
  }
);
DropdownContent.displayName = 'DropdownContent';

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  danger?: boolean;
  onSelect?: () => void;
}
const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, danger, onSelect, onClick, children, ...props }, ref) => {
    const ctx = React.useContext(DropdownContext);
    return (
      <div
        ref={ref}
        className={cn('dropdown-item', danger && 'danger', className)}
        role="menuitem"
        onClick={(e) => {
          onClick?.(e);
          onSelect?.();
          ctx.setOpen(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownItem.displayName = 'DropdownItem';

export interface DropdownSepProps extends React.HTMLAttributes<HTMLHRElement> {}
const DropdownSep = React.forwardRef<HTMLHRElement, DropdownSepProps>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn('dropdown-sep', className)} {...props} />
));
DropdownSep.displayName = 'DropdownSep';

export { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSep };
