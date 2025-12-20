import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Loader2 } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';

const StyledLoader = withUniwind(Loader2);
const AnimatedLoader = Animated.createAnimatedComponent(StyledLoader);

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string; // Hex color if needed, or rely on className
}

const Spinner = ({ className, size = 24 }: SpinnerProps) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1 // Infinite
    );
    return () => cancelAnimation(rotation);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedLoader
      style={style}
      className={cn('text-primary', className)}
      size={size}
    />
  );
};

export { Spinner };
