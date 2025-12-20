import * as React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { cn } from '@/libs/utils';
import { useCSSVariable } from 'uniwind';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RNSwitch> {}

const Switch = React.forwardRef<RNSwitch, SwitchProps>(
  ({ className, ...props }, ref) => {
    const [primaryColor, accentColor, mutedColor] = useCSSVariable([
      '--color-primary',
      '--color-foreground',
      '--color-muted',
    ]);
    return (
      <RNSwitch
        ref={ref}
        trackColor={{
          false: mutedColor as string,
          true: primaryColor as string,
        }}
        thumbColor={'white'}
        ios_backgroundColor={(mutedColor as string) ?? '#E5E5E5'}
        style={{
          transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        }}
        {...props}
      />
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
