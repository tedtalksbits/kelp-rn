import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/libs/utils';

interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

const Separator = React.forwardRef<View, SeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <View
      ref={ref}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };
