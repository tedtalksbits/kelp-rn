import * as React from 'react';
import {
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { cn } from '@/libs/utils';
import { Eye, EyeClosed, EyeOff } from 'lucide-react-native';
import { withUniwind } from 'uniwind';

interface InputProps extends TextInputProps {
  showPasswordToggle?: boolean;
}

const StyledEye = withUniwind(Eye);
const StyledEyeClosed = withUniwind(EyeOff);

const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  InputProps
>(({ className, showPasswordToggle, secureTextEntry, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (showPasswordToggle) {
    return (
      <View className='relative'>
        <TextInput
          ref={ref}
          className={cn(
            'bg-input p-4 rounded-md text-foreground placeholder:text-muted-foreground pr-12',
            className
          )}
          secureTextEntry={!isPasswordVisible}
          {...props}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className='absolute right-4 top-10 -translate-y-1/2 z-10l'
        >
          <Text className='text-muted-foreground'>
            {isPasswordVisible ? (
              <StyledEyeClosed className='text-muted-foreground' />
            ) : (
              <StyledEye className='text-muted-foreground' />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      ref={ref}
      className={cn(
        'bg-input p-4 rounded-md text-foreground placeholder:text-muted-foreground',
        className
      )}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
