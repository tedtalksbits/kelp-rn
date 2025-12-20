import * as React from 'react';
import { View, Pressable, type ViewProps } from 'react-native';
import { Circle } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';

const StyledCircle = withUniwind(Circle);

// --- Context ---
interface RadioGroupContextType {
  value: string | undefined;
  onValueChange: (value: string) => void;
}
const RadioGroupContext = React.createContext<RadioGroupContextType>(
  {} as RadioGroupContextType
);

// --- Root ---
interface RadioGroupProps extends ViewProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<View, RadioGroupProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider
        value={{ value, onValueChange: onValueChange! }}
      >
        <View className={cn('gap-2', className)} ref={ref} {...props} />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

// --- Item ---
interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof Pressable
> {
  value: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  RadioGroupItemProps
>(({ className, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } =
    React.useContext(RadioGroupContext);
  const isChecked = selectedValue === value;

  return (
    <Pressable
      ref={ref}
      onPress={() => onValueChange(value)}
      className={cn(
        'aspect-square h-4 w-4 items-center justify-center rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {isChecked && (
        <StyledCircle
          className='h-2.5 w-2.5 fill-primary text-primary'
          size={10}
        />
      )}
    </Pressable>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
