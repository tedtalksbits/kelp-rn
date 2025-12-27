import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/text';
import ScreenView from '@/components/screen-view';
import { useOnboarding } from '../hooks/use-onboarding';
import { useCreateProfile } from '@/features/user-profile/hooks/use-profile';
import type { OnboardingStep } from '../types/onboarding.types';
import { StepName } from './steps/step-name';
import { StepFitnessLevel } from './steps/step-fitness-level';
import { StepGoalsAreas } from './steps/step-goals-areas';
import { StepEquipment } from './steps/step-equipment';
import { StepPhysicalStats } from './steps/step-physical-stats';
import { StepSchedule } from './steps/step-schedule';
import { StepLimitations } from './steps/step-limitations';
import { StepNotifications } from './steps/step-notifications';
import { supabase } from '@/libs/supabase/supabase';
import { router } from 'expo-router';

const STEPS: OnboardingStep[] = [
  {
    id: 'name',
    title: 'Name',
    component: StepName,
    isValid: (data) => data.name.trim().length >= 2,
  },
  {
    id: 'fitness-level',
    title: 'Fitness Level',
    component: StepFitnessLevel,
    isValid: (data) => data.fitnessLevel !== null,
  },
  {
    id: 'goals-areas',
    title: 'Goals & Areas',
    component: StepGoalsAreas,
    isValid: (data) => data.goals.length > 0 && data.targetAreas.length > 0,
  },
  {
    id: 'equipment',
    title: 'Equipment',
    component: StepEquipment,
    isValid: () => true,
    canSkip: true,
  },
  {
    id: 'physical-stats',
    title: 'Physical Stats',
    component: StepPhysicalStats,
    isValid: (data) =>
      data.age !== null && data.weight !== null && data.height !== null,
  },
  {
    id: 'schedule',
    title: 'Schedule',
    component: StepSchedule,
    isValid: (data) => data.workoutDays.length > 0,
  },
  {
    id: 'limitations',
    title: 'Limitations',
    component: StepLimitations,
    isValid: () => true,
    canSkip: true,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    component: StepNotifications,
    isValid: () => true,
    canSkip: true,
  },
];

export function OnboardingWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { data, updateData, resetData } = useOnboarding();
  const { mutate: createProfile, isPending } = useCreateProfile();

  const currentStep = STEPS[currentStepIndex];
  const StepComponent = currentStep.component;
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const goToNext = async () => {
    // Validate current step
    if (!currentStep.isValid(data)) {
      return;
    }

    // If last step, submit profile
    if (currentStepIndex === STEPS.length - 1) {
      await handleComplete();
      return;
    }

    // Go to next step
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goToPrevious = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    createProfile(
      {
        user_id: user.id,
        name: data.name,
        fitness_level: data.fitnessLevel || 'beginner',
        goals: data.goals,
        target_areas: data.targetAreas,
        available_equipment: data.availableEquipment,
        age: data.age || 25,
        weight_kg: data.weight || 70,
        height_cm: data.height || 170,
        workout_days: data.workoutDays,
        preferred_workout_time: data.preferredWorkoutTime,
        timezone: data.timezone,
        physical_limitations: data.physicalLimitations,
        // notifications_enabled: data.notificationsEnabled,
      },
      {
        onSuccess: () => {
          resetData();
          router.replace('/(tabs)');
        },
      }
    );
  };

  if (isPending) {
    return (
      <ScreenView className='items-center justify-center'>
        <ActivityIndicator size='large' color='#a3e635' />
        <Text className='text-muted-foreground mt-4'>
          Setting up your profile...
        </Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView className='bg-background'>
      {/* Progress Bar */}
      <View className='w-full h-1 bg-secondary'>
        <View className='h-full bg-primary' style={{ width: `${progress}%` }} />
      </View>

      {/* Step Indicator */}
      <View className='px-6 py-4 border-b border-border'>
        <Text className='text-xs text-muted-foreground uppercase font-bold'>
          Step {currentStepIndex + 1} of {STEPS.length}
        </Text>
        <Text className='text-sm font-bold'>{currentStep.title}</Text>
      </View>

      {/* Step Content */}
      <View className='flex-1 px-6'>
        <StepComponent
          data={data}
          updateData={updateData}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === STEPS.length - 1}
        />
      </View>
    </ScreenView>
  );
}
