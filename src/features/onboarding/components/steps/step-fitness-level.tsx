import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { cn } from '@/libs/utils';
import { Check } from 'lucide-react-native';

const FITNESS_LEVELS = [
  {
    value: 'beginner' as const,
    label: 'Beginner',
    description: 'New to fitness or returning after a break',
  },
  {
    value: 'intermediate' as const,
    label: 'Intermediate',
    description: 'Regular exercise routine for several months',
  },
  {
    value: 'advanced' as const,
    label: 'Advanced',
    description: 'Consistent training for over a year',
  },
];

export function StepFitnessLevel({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const isValid = data.fitnessLevel !== null;

  return (
    <View className='flex-1 justify-between py-8'>
      <View>
        <Text className='text-4xl font-black uppercase mb-4'>
          Fitness Level
        </Text>
        <Text className='text-muted-foreground mb-8'>
          This helps us recommend the right workouts for you.
        </Text>

        <View className='gap-4'>
          {FITNESS_LEVELS.map((level) => {
            const isSelected = data.fitnessLevel === level.value;
            return (
              <Pressable
                key={level.value}
                onPress={() => updateData({ fitnessLevel: level.value })}
              >
                <Surface
                  className={cn(
                    'p-4 border-2',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  )}
                >
                  <View className='flex flex-row items-center justify-between mb-2'>
                    <Text className='text-lg font-bold'>{level.label}</Text>
                    {isSelected && <Check size={24} color='#a3e635' />}
                  </View>
                  <Text className='text-sm text-muted-foreground'>
                    {level.description}
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
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
    </View>
  );
}
