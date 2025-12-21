import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Slot, Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import '../global.css';
import { AppThemeProvider } from '../contexts/app-theme-context';
import { Toaster } from 'sonner-native';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { PortalHost } from '@rn-primitives/portal';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

/**
 * Component that wraps app content inside KeyboardProvider
 * Contains the contentWrapper and HeroUINativeProvider configuration
 */
function AppContent() {
  const contentWrapper = useCallback(
    (children: React.ReactNode) => (
      <KeyboardAvoidingView
        pointerEvents='box-none'
        behavior='padding'
        keyboardVerticalOffset={12}
        className='flex-1'
      >
        {children}
      </KeyboardAvoidingView>
    ),
    []
  );

  return (
    <KeyboardAvoidingView
      pointerEvents='box-none'
      behavior='padding'
      keyboardVerticalOffset={12}
      className='flex-1'
    >
      <View className='flex-1 bg-background'>
        <QueryProvider>
          <AuthProvider>
            <AppThemeProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='index' />
                <Stack.Screen name='(auth)' />
                <Stack.Screen name='(tabs)' />
              </Stack>
              <PortalHost />
              <Toaster position='top-center' />
            </AppThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function Layout() {
  const fonts = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fonts) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <AppContent />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
