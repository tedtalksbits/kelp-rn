import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';

const StyledCheck = withUniwind(Check);

interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof Pressable
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      role='checkbox'
      aria-checked={checked}
      onPress={() => onCheckedChange?.(!checked)}
      className={cn(
        'peer h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
        className
      )}
      {...props}
    >
      {checked && (
        <StyledCheck
          className='h-2 w-3 text-primary-foreground'
          strokeWidth={3}
        />
      )}
    </Pressable>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
