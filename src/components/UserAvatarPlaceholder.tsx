import { User } from 'lucide-react';
import { cn } from './ui/utils';

interface UserAvatarPlaceholderProps {
  className?: string;
  iconClassName?: string;
}

export function UserAvatarPlaceholder({
  className,
  iconClassName,
}: UserAvatarPlaceholderProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-[#9810fa] to-[#2b7fff] flex items-center justify-center text-white',
        className
      )}
    >
      <User
        className={cn('text-white', iconClassName ?? 'w-1/2 h-1/2')}
        strokeWidth={1.5}
      />
    </div>
  );
}

