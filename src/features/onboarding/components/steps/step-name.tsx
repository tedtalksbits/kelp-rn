import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import type { OnboardingStepProps } from '../../types/onboarding.types';

export function StepName({
  data,
  updateData,
  goToNext,
  isFirstStep,
}: OnboardingStepProps) {
  const isValid = data.name.trim().length >= 2;

  return (
    <View className='flex-1 justify-between py-8'>
      <View>
        <Text className='text-4xl font-black uppercase mb-4'>
          What's your name?
        </Text>
        <Text className='text-muted-foreground mb-8'>
          Let's start with the basics. What should we call you?
        </Text>

        <TextInput
          value={data.name}
          onChangeText={(text) => updateData({ name: text })}
          placeholder='Enter your name'
          placeholderTextColor='#71717a'
          className='bg-surface rounded-lg px-4 py-4 text-foreground text-lg border-2 border-border focus:border-primary'
          autoFocus
          returnKeyType='next'
          onSubmitEditing={() => isValid && goToNext()}
        />
      </View>

      <Button
        size='lg'
        onPress={goToNext}
        disabled={!isValid}
        className='w-full'
      >
        <Text className='text-primary-foreground font-bold text-lg'>
          Continue
        </Text>
      </Button>
    </View>
  );
}
