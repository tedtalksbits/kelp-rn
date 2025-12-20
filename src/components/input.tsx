import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/libs/utils';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(({ className, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'bg-input p-4 rounded-md text-foreground placeholder:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
