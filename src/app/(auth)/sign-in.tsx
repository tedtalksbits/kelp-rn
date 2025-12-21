import { Image, ImageBackground, View } from 'react-native';
import React from 'react';
import { ScreenScrollView } from '@/components/screen-scroll-view';
import { Text } from '@/components/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenView from '@/components/screen-view';
import Logo from '../../../assets/hero.png';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Link } from 'expo-router';

export default function SignInScreen() {
  return (
    <View className='flex-1 bg-background relative'>
      <ParallaxScrollView
        h={0.5}
        headerImage={<Image source={Logo} style={{ flex: 1 }} />}
      >
        <Text className='text-4xl font-black text-white uppercase leading-tight mb-4 text-center'>
          Consistency is your superpower.
        </Text>
        <Text className='text-center text-base leading-relaxed text-muted-foreground'>
          Sign in to continue tracking your workouts, monitoring progress, and
          achieving your fitness goals.
        </Text>
        <View>
          <Input placeholder='Email' className='mt-6' />
          <Input
            placeholder='Password'
            secureTextEntry
            showPasswordToggle
            className='mt-4'
          />

          <Text className='text-primary text-right mt-2'>Forgot Password?</Text>

          <Button className='mt-6'>Sign In</Button>

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
