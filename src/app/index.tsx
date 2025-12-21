import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/providers/auth-provider';
import { Text } from '@/components/text';

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [session, loading]);

  return (
    <View className='flex-1 bg-background'>
      <Text className='text-center text-foreground mt-20'>Loading...</Text>
    </View>
  );
}
