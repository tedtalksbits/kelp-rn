import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { cn } from '@/libs/utils';

const GOALS = [
  'Lose Weight',
  'Build Muscle',
  'Increase Strength',
  'Improve Endurance',
  'Stay Active',
  'Sport-Specific Training',
];

const TARGET_AREAS = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
  'Arms',
  'Chest',
  'Back',
  'Shoulders',
  'Legs',
  'Glutes',
];

export function StepGoalsAreas({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const isValid = data.goals.length > 0 && data.targetAreas.length > 0;

  const toggleGoal = (goal: string) => {
    updateData({
      goals: data.goals.includes(goal)
        ? data.goals.filter((g) => g !== goal)
        : [...data.goals, goal],
    });
  };

  const toggleArea = (area: string) => {
    updateData({
      targetAreas: data.targetAreas.includes(area)
        ? data.targetAreas.filter((a) => a !== area)
        : [...data.targetAreas, area],
    });
  };

  return (
    <View className='flex-1 py-8'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <Text className='text-4xl font-black uppercase mb-4'>Your Goals</Text>
        <Text className='text-muted-foreground mb-8'>
          What do you want to achieve? Select all that apply.
        </Text>

        <View className='flex flex-row flex-wrap gap-3 mb-8'>
          {GOALS.map((goal) => {
            const isSelected = data.goals.includes(goal);
            return (
              <Pressable key={goal} onPress={() => toggleGoal(goal)}>
                <Surface
                  className={cn(
                    'px-4 py-3 border-2',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-bold text-sm uppercase tracking-wide',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {goal}
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
        </View>

        <Text className='text-4xl font-black uppercase mb-4'>Target Areas</Text>
        <Text className='text-muted-foreground mb-8'>
          Which areas would you like to focus on?
        </Text>

        <View className='flex flex-row flex-wrap gap-3 mb-8'>
          {TARGET_AREAS.map((area) => {
            const isSelected = data.targetAreas.includes(area);
            return (
              <Pressable key={area} onPress={() => toggleArea(area)}>
                <Surface
                  className={cn(
                    'px-4 py-3 border-2',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-bold text-sm uppercase tracking-wide',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {area}
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className='gap-3 pt-4'>
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
