import * as React from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import { cn } from '@/libs/utils';
import { ViewProps } from 'react-native';

const Skeleton = React.forwardRef<Animated.View, ViewProps>(
  ({ className, ...props }, ref) => {
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }), // fade out slightly
          withTiming(1, { duration: 1000 }) // fade in
        ),
        -1, // infinite loop
        true // reverse
      );
    }, []);

    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        ref={ref}
        className={cn('rounded-md bg-muted', className)}
        style={[style, props.style]}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
