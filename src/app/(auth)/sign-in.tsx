import { Image, ImageBackground, View } from 'react-native';
import React, { useState } from 'react';
import { ScreenScrollView } from '@/components/screen-scroll-view';
import { Text } from '@/components/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenView from '@/components/screen-view';
import Logo from '../../../assets/hero.png';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Link, router } from 'expo-router';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';
import { withUniwind } from 'uniwind';
import { AlertCircle } from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { useHaptics } from '@/components/use-haptics';
const StyledAlertIcon = withUniwind(AlertCircle);
export default function SignInScreen() {
  const haptics = useHaptics();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync: signIn, isPending } = useSignIn();

  const handleSignIn = async () => {
    setError(null);
    const result = await signIn({ email, password });

    if (result.error) {
      setError(result.error?.message || 'An unknown error occurred');
      haptics.error();
      return;
    }
    haptics.success();
    router.replace('/(tabs)');
  };
  return (
    <View className='flex-1 bg-background relative'>
      <ParallaxScrollView
        h={0.5}
        headerImage={<Image source={Logo} style={{ flex: 1 }} />}
      >
        <Text className='text-4xl font-black uppercase leading-tight mb-4 text-center'>
          Consistency is your superpower.
        </Text>
        <Text className='text-center text-base leading-relaxed text-muted-foreground'>
          Sign in to continue tracking your workouts, monitoring progress, and
          achieving your fitness goals.
        </Text>
        <View>
          <Input
            placeholder='Email'
            className={cn('mt-6', error && 'border-destructive border')}
            value={email}
            onChangeText={(t) => {
              setError(null);
              setEmail(t);
            }}
          />
          <Input
            placeholder='Password'
            secureTextEntry
            showPasswordToggle
            className={cn('mt-4', error && 'border-destructive border')}
            value={password}
            onChangeText={(t) => {
              setError(null);
              setPassword(t);
            }}
          />

          {error && (
            <View className='flex-row items-center mt-2 gap-1'>
              <StyledAlertIcon className='text-destructive' size={16} />
              <Text className='text-destructive'>{error}</Text>
            </View>
          )}

          <Text className='text-primary text-right mt-2'>Forgot Password?</Text>

          <Button
            className='mt-6'
            onPress={handleSignIn}
            disabled={isPending || !email || !password}
          >
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>

          <Link href='/(auth)/sign-up' asChild>
            <Text className='text-center text-base leading-relaxed text-muted-foreground mt-4'>
              Don't have an account?{' '}
              <Text className='text-primary'>Sign Up</Text>
            </Text>
          </Link>
        </View>
      </ParallaxScrollView>
    </View>
  );
}
