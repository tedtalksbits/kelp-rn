import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import type { OnboardingStepProps } from '../../types/onboarding.types';
import { cn } from '@/libs/utils';

const LIMITATIONS = [
  'None',
  'Back Pain',
  'Knee Issues',
  'Shoulder Problems',
  'Wrist Issues',
  'Ankle Problems',
  'Hip Issues',
  'Neck Problems',
  'Recent Surgery',
  'Other Injury',
];

export function StepLimitations({
  data,
  updateData,
  goToNext,
  goToPrevious,
}: OnboardingStepProps) {
  const toggleLimitation = (limitation: string) => {
    // If "None" is selected, clear all others
    if (limitation === 'None') {
      updateData({ physicalLimitations: [] });
      return;
    }

    // If selecting other limitations, remove "None"
    const filtered = data.physicalLimitations.filter((l) => l !== 'None');

    updateData({
      physicalLimitations: filtered.includes(limitation)
        ? filtered.filter((l) => l !== limitation)
        : [...filtered, limitation],
    });
  };

  return (
    <View className='flex-1 py-8'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <Text className='text-4xl font-black uppercase mb-4'>
          Physical Limitations
        </Text>
        <Text className='text-muted-foreground mb-8'>
          Do you have any physical limitations we should know about? This helps
          us recommend safer exercises.
        </Text>

        <View className='flex flex-row flex-wrap gap-3 mb-8'>
          {LIMITATIONS.map((limitation) => {
            const isSelected =
              limitation === 'None'
                ? data.physicalLimitations.length === 0
                : data.physicalLimitations.includes(limitation);

            return (
              <Pressable
                key={limitation}
                onPress={() => toggleLimitation(limitation)}
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
                    {limitation}
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
          <Text className='text-secondary-foreground font-bold text-lg'>
            Back
          </Text>
        </Button>
      </View>
    </View>
  );
}
