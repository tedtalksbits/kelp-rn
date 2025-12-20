import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/libs/utils';
import { Separator } from './separator';

interface SurfaceProps extends ViewProps {
  divider?: 'x' | 'y';
}

const Surface = React.forwardRef<View, SurfaceProps>(
  ({ className, divider, children, ...props }, ref) => {
    const content = divider
      ? React.Children.toArray(children).map((child, index, array) => (
          <React.Fragment key={index}>
            {child}
            {index < array.length - 1 && (
              <Separator
                orientation={divider === 'y' ? 'horizontal' : 'vertical'}
              />
            )}
          </React.Fragment>
        ))
      : children;

    return (
      <View
        ref={ref}
        className={cn('rounded-lg bg-card p-4', className)}
        {...props}
      >
        {content}
      </View>
    );
  }
);
Surface.displayName = 'Surface';

export { Surface };
