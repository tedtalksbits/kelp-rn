import React from 'react';
import { View, Platform, Alert } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { Bell, BellOff } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';

export function StepNotifications({
  data,
  updateData,
  goToNext,
  goToPrevious,
  isLastStep,
}: OnboardingStepProps) {
  const [isRequesting, setIsRequesting] = React.useState(false);

  const requestPermissions = async () => {
    setIsRequesting(true);
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        updateData({ notificationsEnabled: true });
        Alert.alert(
          'Success',
          "Notifications enabled! We'll remind you about your workouts."
        );
      } else {
        updateData({ notificationsEnabled: false });
        Alert.alert(
          'Notifications Disabled',
          'You can enable them later in your device settings.'
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <View className='flex-1 justify-between py-8'>
      <View>
        <Text className='text-4xl font-black uppercase mb-4'>
          Stay Motivated
        </Text>
        <Text className='text-muted-foreground mb-8'>
          Enable notifications to get reminders for your scheduled workouts and
          track your progress.
        </Text>

        <Surface className='p-6 items-center border-2 border-border mb-6'>
          <View
            className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
              data.notificationsEnabled ? 'bg-primary/20' : 'bg-muted'
            }`}
          >
            {data.notificationsEnabled ? (
              <Bell size={40} color='#a3e635' />
            ) : (
              <BellOff size={40} color='#71717a' />
            )}
          </View>
          <Text className='text-lg font-bold text-center mb-2'>
            {data.notificationsEnabled
              ? 'Notifications Enabled'
              : 'Notifications Disabled'}
          </Text>
          <Text className='text-sm text-muted-foreground text-center'>
            {data.notificationsEnabled
              ? "You'll receive workout reminders"
              : "You won't receive workout reminders"}
          </Text>
        </Surface>

        {!data.notificationsEnabled && (
          <Button
            size='lg'
            onPress={requestPermissions}
            disabled={isRequesting}
            className='w-full mb-4'
          >
            <Text className='text-primary-foreground font-bold text-lg'>
              {isRequesting ? 'Requesting...' : 'Enable Notifications'}
            </Text>
          </Button>
        )}
      </View>

      <View className='gap-3'>
        <Button size='lg' onPress={goToNext}>
          <Text className='text-primary-foreground font-bold text-lg'>
            {isLastStep ? 'Complete Setup' : 'Continue'}
          </Text>
        </Button>
        <Button size='lg' variant='secondary' onPress={goToPrevious}>
          <Text className='text-foreground font-bold text-lg'>Back</Text>
        </Button>
      </View>
    </View>
  );
}
