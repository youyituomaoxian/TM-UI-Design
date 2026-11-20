/*
 * Tag — vendored shadcn Badge 对位（弘讯B端适配）
 * contract: tag.size 高22 HIGH · 半径4 HIGH · 字重400 MEDIUM。
 * 4 态浅底（soft 底 + 语义色字）+ 默认灰。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type TagVariant = 'success' | 'warning' | 'error' | 'running' | 'default';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variantClass: Record<TagVariant, string> = {
  success: 'tag-suc',
  warning: 'tag-warn',
  error: 'tag-err',
  running: 'tag-run',
  default: 'tag-def'
};

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span ref={ref} className={cn('tag', variantClass[variant], className)} {...props} />
  )
);
Tag.displayName = 'Tag';

export { Tag };
