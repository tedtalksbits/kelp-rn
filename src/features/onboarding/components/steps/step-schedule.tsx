import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { cn } from '@/libs/utils';
import { BottomSheet } from '@/components/bottom-sheet';

const DAYS = [
  { value: 'monday', label: 'M' },
  { value: 'tuesday', label: 'T' },
  { value: 'wednesday', label: 'W' },
  { value: 'thursday', label: 'T' },
  { value: 'friday', label: 'F' },
  { value: 'saturday', label: 'S' },
  { value: 'sunday', label: 'S' },
];

const WORKOUT_TIMES = [
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export function StepSchedule({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const [timeSheetOpen, setTimeSheetOpen] = React.useState(false);
  const isValid = data.workoutDays.length > 0;

  const toggleDay = (day: string) => {
    updateData({
      workoutDays: data.workoutDays.includes(day)
        ? data.workoutDays.filter((d) => d !== day)
        : [...data.workoutDays, day],
    });
  };

  return (
    <View className='flex-1 justify-between py-8'>
      <View>
        <Text className='text-4xl font-black uppercase mb-4'>
          Your Schedule
        </Text>
        <Text className='text-muted-foreground mb-8'>
          When do you prefer to work out?
        </Text>

        {/* Workout Days */}
        <View className='mb-6'>
          <Text className='text-sm font-bold uppercase text-muted-foreground mb-4'>
            Workout Days
          </Text>
          <View className='flex flex-row justify-between gap-2'>
            {DAYS.map((day) => {
              const isSelected = data.workoutDays.includes(day.value);
              return (
                <Pressable
                  key={day.value}
                  onPress={() => toggleDay(day.value)}
                  className={cn(
                    'w-12 h-12 items-center justify-center border-2 rounded-lg',
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-border bg-surface'
                  )}
                >
                  <Text
                    className={cn(
                      'font-bold text-sm',
                      isSelected
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {day.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Preferred Time */}
        <View>
          <Text className='text-sm font-bold uppercase text-muted-foreground mb-4'>
            Preferred Time (Optional)
          </Text>
          <Pressable onPress={() => setTimeSheetOpen(true)}>
            <Surface className='p-4'>
              <Text className='text-xs text-muted-foreground mb-1 uppercase'>
                Time
              </Text>
              <Text className='text-2xl font-bold'>
                {data.preferredWorkoutTime || 'Anytime'}
              </Text>
            </Surface>
          </Pressable>
        </View>
      </View>

      <View className='gap-3'>
        <Button size='lg' onPress={goToNext} disabled={!isValid}>
          <Text className='text-primary-foreground font-bold text-lg'>
            Continue
          </Text>
        </Button>
        <Button size='lg' variant='secondary' onPress={goToPrevious}>
          <Text className='text-secondary-foreground font-bold text-lg'>
            Back
          </Text>
        </Button>
      </View>

      {/* Time Bottom Sheet */}
      <BottomSheet
        isVisible={timeSheetOpen}
        onClose={() => setTimeSheetOpen(false)}
        title='Select Workout Time'
        snapPoints={[0.6]}
      >
        <View className='px-4 gap-2'>
          {WORKOUT_TIMES.map((time) => (
            <Pressable
              key={time}
              onPress={() => {
                updateData({ preferredWorkoutTime: time });
                setTimeSheetOpen(false);
              }}
            >
              <Surface className='p-4'>
                <Text className='text-lg font-bold'>{time}</Text>
              </Surface>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
