import { useAppTheme } from '@/contexts/app-theme-context';
import { Slot, Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/theme/use-theme-colors';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import LogoDark from '../../../assets/icons/logo.png';
import LogoLight from '../../../assets/icons/logo.png';
import { ThemeToggle } from '@/components/theme-toggle';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { PortalHost } from '@rn-primitives/portal';
import { Text } from '@/components/text';

export default function Layout() {
  const { isDark } = useAppTheme();
  const themeColorForeground = useThemeColor('foreground');
  const themeColorBackground = useThemeColor('background');

  const _renderTitle = () => {
    return (
      <View className='flex-row items-center gap-1'>
        <Image
          source={isDark ? LogoLight : LogoDark}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text>Grounded</Text>
      </View>
    );
  };

  const _renderThemeToggle = useCallback(() => <ThemeToggle />, []);
  return (
    <View className='flex-1 bg-background'>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerBlurEffect: isDark ? 'dark' : 'light',
          headerTintColor: themeColorForeground,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: undefined,
              android: themeColorBackground,
            }),
          },
          headerTitleStyle: {
            fontFamily: 'Inter_600SemiBold',
          },
          headerRight: _renderThemeToggle,
          headerBackButtonDisplayMode: 'generic',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: isLiquidGlassAvailable() ? false : true,
          contentStyle: {
            backgroundColor: themeColorBackground,
          },
        }}
      >
        <Stack.Screen
          name='index'
          options={{
            headerTitle: _renderTitle,
          }}
        />
        <Slot />
      </Stack>
      <PortalHost />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    objectFit: 'contain',
    width: 24,
    height: 24,
  },
});
