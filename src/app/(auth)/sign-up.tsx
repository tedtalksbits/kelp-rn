import { Alert, Image, View } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/text';
import Logo from '../../../assets/hero.png';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@/features/auth/hooks/use-auth';
import { useHaptics } from '@/components/use-haptics';
import { AlertCircle } from 'lucide-react-native';
import { withUniwind } from 'uniwind';
const StyledAlertIcon = withUniwind(AlertCircle);
export default function SignUpScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutateAsync: signUp, isPending } = useSignUp();
  const handleSignUp = async () => {
    setError(null);
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      haptics.error();
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      haptics.error();
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const result = await signUp({ email, password });

    if (result.error) {
      setError(result.error?.message || 'An unknown error occurred');
      haptics.error();
      return;
    }

    haptics.success();
    router.replace(
      '/(auth)/sign-in' + '?signedUp=true&email=' + encodeURIComponent(email)
    );
  };
  return (
    <View className='flex-1 bg-background relative'>
      <ParallaxScrollView
        h={0.5}
        headerImage={<Image source={Logo} style={{ flex: 1 }} />}
      >
        <Text className='text-4xl font-black uppercase leading-tight mb-4 text-center'>
          Start your fitness journey.
        </Text>
        <Text className='text-center text-base leading-relaxed text-muted-foreground'>
          Create your account to start tracking workouts, monitoring progress,
          and achieving your fitness goals.
        </Text>
        <View>
          <Input
            placeholder='Email'
            className='mt-6'
            value={email}
            onChangeText={setEmail}
            autoComplete='email'
            autoCapitalize='none'
            keyboardType='email-address'
          />
          <Input
            placeholder='Password'
            secureTextEntry
            showPasswordToggle
            className='mt-4'
            value={password}
            onChangeText={setPassword}
            autoComplete='new-password'
          />
          <Input
            placeholder='Confirm Password'
            secureTextEntry
            showPasswordToggle
            className='mt-4'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete='new-password'
          />

          {error && (
            <View className='flex-row items-center mt-2 gap-1'>
              <StyledAlertIcon className='text-destructive' size={16} />
              <Text className='text-destructive'>{error}</Text>
            </View>
          )}

          <Button className='mt-6' onPress={handleSignUp} disabled={isPending}>
            Sign Up
          </Button>

          <Link href='/(auth)/sign-in' asChild>
            <Text className='text-center text-base leading-relaxed text-muted-foreground mt-4'>
              Already have an account?{' '}
              <Text className='text-primary'>Sign In</Text>
            </Text>
          </Link>
        </View>
      </ParallaxScrollView>
    </View>
  );
}
