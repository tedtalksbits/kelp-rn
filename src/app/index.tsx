import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/providers/auth-provider';
import { useProfile } from '@/features/user-profile/hooks/use-profile';
import { OnboardingWizard } from '@/features/onboarding';
import { Text } from '@/components/text';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!session) {
        router.replace('/(auth)/sign-in');
      } else if (profile) {
        router.replace('/(tabs)');
      }
      // If session exists but no profile, stay here to show onboarding
    }
  }, [session, profile, authLoading, profileLoading]);

  // Show loading while checking auth and profile
  if (authLoading || profileLoading) {
    return (
      <View className='flex-1 bg-background'>
        <Text className='text-center text-foreground mt-20'>Loading...</Text>
      </View>
    );
  }

  // Show onboarding if user is authenticated but has no profile
  if (session && !profile) {
    return <OnboardingWizard />;
  }

  return (
    <View className='flex-1 bg-background'>
      <Text className='text-center text-foreground mt-20'>Loading...</Text>
    </View>
  );
}
