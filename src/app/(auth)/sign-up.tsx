import { Image, View } from 'react-native';
import React from 'react';
import { Text } from '@/components/text';
import Logo from '../../../assets/hero.png';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Link } from 'expo-router';

export default function SignUpScreen() {
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
          <Input placeholder='Email' className='mt-6' />
          <Input
            placeholder='Password'
            secureTextEntry
            showPasswordToggle
            className='mt-4'
          />
          <Input
            placeholder='Confirm Password'
            secureTextEntry
            showPasswordToggle
            className='mt-4'
          />

          <Button className='mt-6'>Sign Up</Button>

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
