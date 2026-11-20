/*
 * Accordion — vendored shadcn 风格（语义类 .accordion / .accordion-item / .accordion-trigger / .accordion-content）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

type AccordionContextValue = { open: string[]; toggle: (value: string) => void };
const AccordionContext = React.createContext<AccordionContextValue>({ open: [], toggle: () => {} });

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = 'single', defaultValue = [], children, ...props }, ref) => {
    const [open, setOpen] = React.useState<string[]>(defaultValue);
    const toggle = (value: string) => {
      setOpen((prev) => {
        const has = prev.includes(value);
        if (type === 'single') return has ? [] : [value];
        return has ? prev.filter((x) => x !== value) : [...prev, value];
      });
    };
    return (
      <AccordionContext.Provider value={{ open, toggle }}>
        <div ref={ref} className={cn('accordion', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <div ref={ref} className={cn('accordion-item', className)} data-value={value} {...props} />
  )
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, onClick, children, ...props }, ref) => {
    const { open, toggle } = React.useContext(AccordionContext);
    const isOpen = open.includes(value);
    return (
      <button
        ref={ref}
        type="button"
        className={cn('accordion-trigger', className)}
        aria-expanded={isOpen}
        onClick={(e) => {
          onClick?.(e);
          toggle(value);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { open } = React.useContext(AccordionContext);
    if (!open.includes(value)) return null;
    return (
      <div ref={ref} className={cn('accordion-content', className)} {...props}>
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
