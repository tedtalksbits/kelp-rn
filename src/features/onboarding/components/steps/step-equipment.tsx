import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { cn } from '@/libs/utils';

const EQUIPMENT_OPTIONS = [
  'No Equipment',
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Bench',
  'Squat Rack',
  'Cable Machine',
  'Full Gym Access',
];

export function StepEquipment({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const toggleEquipment = (equipment: string) => {
    // If "No Equipment" is selected, clear all others
    if (equipment === 'No Equipment') {
      updateData({ availableEquipment: ['No Equipment'] });
      return;
    }

    // If selecting other equipment, remove "No Equipment"
    const filtered = data.availableEquipment.filter(
      (e) => e !== 'No Equipment'
    );

    updateData({
      availableEquipment: filtered.includes(equipment)
        ? filtered.filter((e) => e !== equipment)
        : [...filtered, equipment],
    });
  };

  return (
    <View className='flex-1 py-8'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <Text className='text-4xl font-black uppercase mb-4'>Equipment</Text>
        <Text className='text-muted-foreground mb-8'>
          What equipment do you have access to? Select all that apply.
        </Text>

        <View className='flex flex-row flex-wrap gap-3 mb-8'>
          {EQUIPMENT_OPTIONS.map((equipment) => {
            const isSelected = data.availableEquipment.includes(equipment);
            return (
              <Pressable
                key={equipment}
                onPress={() => toggleEquipment(equipment)}
              >
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
                    {equipment}
                  </Text>
                </Surface>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className='gap-3 pt-4'>
        <Button size='lg' onPress={goToNext}>
          <Text className='text-primary-foreground font-bold text-lg'>
            Continue
          </Text>
        </Button>
        <Button size='lg' variant='secondary' onPress={goToPrevious}>
          <Text className='text-foreground font-bold text-lg'>Back</Text>
        </Button>
      </View>
    </View>
  );
}
