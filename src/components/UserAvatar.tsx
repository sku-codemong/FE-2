import { useState } from 'react';
import { cn } from './ui/utils';
import { UserAvatarPlaceholder } from './UserAvatarPlaceholder';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  iconClassName?: string;
}

export function UserAvatar({
  src,
  alt = 'Profile',
  className,
  iconClassName,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && src.trim() !== '' && !failed;

  return (
    <div className={cn('relative', className)}>
      <UserAvatarPlaceholder
        className="w-full h-full rounded-full"
        iconClassName={iconClassName}
      />
      {showImage && (
        <img
          src={src!}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

