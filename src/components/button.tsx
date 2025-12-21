import { cn } from '@/libs/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { Text } from './text';
import React from 'react';

const buttonVariants = cva('flex flex-row items-center justify-center', {
  variants: {
    variant: {
      success: 'bg-success',
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      ghost: 'bg-transparent',
      link: 'text-primary underline-offset-4',
      outline: 'bg-foreground/10',
      accent: 'bg-accent',
    },
    size: {
      // default: 'h-14 px-6',
      // xs: 'h-8 px-2',
      // sm: 'h-12 px-8',
      // md: 'h-14 px-6',
      // lg: 'h-16 px-10',
      // icon: 'h-12 w-12 p-0',
      // 'icon sm': 'h-8 w-8 p-0',
      // 'icon lg': 'h-16 w-16 p-0',
      // 'icon xl': 'h-20 w-20 p-0',
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
    type: {
      pill: 'rounded-[999px]',
      default: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    type: 'default',
  },
});

const buttonTextVariants = cva('text-center capitalize', {
  variants: {
    variant: {
      success: 'text-success-foreground',
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      ghost: 'text-foreground',
      link: 'text-primary-foreground underline',
      outline: 'text-foreground',
      accent: 'text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
interface ButtonProps
  extends
    React.ComponentPropsWithRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  labelProps?: TextProps;
  icon?: React.ReactNode;
}
interface TextProps extends React.ComponentPropsWithoutRef<typeof Text> {}

const Button = React.forwardRef<View, ButtonProps>(
  (
    { labelProps, label, className, variant, type, size, children, ...props },
    ref
  ) => {
    return (
      <TouchableOpacity
        {...props}
        className={cn(buttonVariants({ variant, size, type, className }))}
        style={[props.style, { opacity: props.disabled ? 0.6 : 1 }]}
      >
        {props.icon && (
          <View className='mr-2 shrink-0'>
            {typeof props.icon === 'string' ? (
              <Text className='text-lg'>{props.icon}</Text>
            ) : (
              props.icon
            )}
          </View>
        )}
        {label && (
          <Text
            variant='callout'
            className={cn(
              'font-semibold',
              buttonTextVariants({ variant }),
              labelProps?.className
            )}
            {...labelProps}
          >
            {label}
          </Text>
        )}

        {children ? (
          <Text
            className={cn(
              'font-semibold',
              buttonTextVariants({ variant }),
              labelProps?.className
            )}
          >
            {children}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }
);

export { Button, buttonVariants, buttonTextVariants };
