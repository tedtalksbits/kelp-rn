import * as React from 'react';
import { View, Text, type ViewProps, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/libs/utils';

// 1. Badge Container Variants
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// 2. Badge Text Variants (to match the background contrast)
const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends ViewProps, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<View, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export interface BadgeTextProps
  extends TextProps, VariantProps<typeof badgeTextVariants> {}

const BadgeText = React.forwardRef<Text, BadgeTextProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(badgeTextVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
BadgeText.displayName = 'BadgeText';

export { Badge, BadgeText, badgeVariants };
