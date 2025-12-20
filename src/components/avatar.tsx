import * as React from 'react';
import {
  View,
  Image,
  Text,
  type ImageProps,
  type ViewProps,
  type TextProps,
} from 'react-native';
import { cn } from '@/libs/utils';

// --- 1. Root ---
const Avatar = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = 'Avatar';

// --- 2. Image ---
// We add a simple state to handle error/loading scenarios
const AvatarImage = React.forwardRef<Image, ImageProps>(
  ({ className, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (hasError) {
      return null;
    }

    return (
      <Image
        ref={ref}
        onError={() => setHasError(true)}
        className={cn('aspect-square h-full w-full', className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = 'AvatarImage';

// --- 3. Fallback ---
const AvatarFallback = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = 'AvatarFallback';

// --- 4. Fallback Text Helper ---
// Optional helper to center text properly inside the fallback
const AvatarFallbackText = React.forwardRef<Text, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn('text-sm font-medium text-muted-foreground', className)}
      {...props}
    />
  )
);
AvatarFallbackText.displayName = 'AvatarFallbackText';

export { Avatar, AvatarImage, AvatarFallback, AvatarFallbackText };
