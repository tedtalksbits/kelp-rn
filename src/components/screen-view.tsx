import { View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { cn } from '@/libs/utils';
import { withUniwind } from 'uniwind';

interface ScreenLayoutProps extends React.ComponentPropsWithoutRef<
  typeof View
> {
  children: React.ReactNode;
}

const StyledSafeAreaView = withUniwind(SafeAreaView);
export default function ScreenView({
  children,
  className,
  ...props
}: ScreenLayoutProps) {
  return (
    <StyledSafeAreaView
      className={cn('flex-1 bg-background', className)}
      {...props}
    >
      {children}
      <StatusBar style='auto' />
    </StyledSafeAreaView>
  );
}
