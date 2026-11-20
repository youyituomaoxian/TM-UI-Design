/*
 * Breadcrumb — vendored shadcn 风格（语义类 .breadcrumb / .breadcrumb-item / .breadcrumb-sep）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn('breadcrumb', className)} {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  current?: boolean;
}
const BreadcrumbItem = React.forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ className, current, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('breadcrumb-item', className)}
      aria-current={current ? 'page' : undefined}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbSepProps extends React.HTMLAttributes<HTMLSpanElement> {}
const BreadcrumbSep = React.forwardRef<HTMLSpanElement, BreadcrumbSepProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('breadcrumb-sep', className)} {...props} />
));
BreadcrumbSep.displayName = 'BreadcrumbSep';

export { Breadcrumb, BreadcrumbItem, BreadcrumbSep };
