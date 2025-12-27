import { ScrollView } from 'react-native';
import React from 'react';
import { cn } from '@/libs/utils';

interface ScreenScrollViewProps extends React.ComponentPropsWithoutRef<
  typeof ScrollView
> {
  children: React.ReactNode;
}
export default function ScreenScrollView({
  children,
  className,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  ...props
}: ScreenScrollViewProps) {
  return (
    <ScrollView
      className={cn('flex-1 bg-background px-4', className)}
      contentContainerStyle={[
        {
          paddingBottom: 20,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
