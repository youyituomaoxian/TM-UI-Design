/*
 * Avatar — vendored shadcn 风格（语义类 .avatar / .avatar-sm / .avatar-lg / .avatar-fallback）。
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'sm' | 'default' | 'lg';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: React.ReactNode;
}

const sizeClass: Record<AvatarSize, string> = {
  sm: 'avatar-sm',
  default: '',
  lg: 'avatar-lg'
};

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, size = 'default', fallback, children, ...props }, ref) => (
    <span ref={ref} className={cn('avatar', sizeClass[size], className)} {...props}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        fallback ?? children ?? <span className="avatar-fallback" />
      )}
    </span>
  )
);
Avatar.displayName = 'Avatar';

export { Avatar };
