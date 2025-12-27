import { useState, useCallback } from 'react';
import type { OnboardingData } from '../types/onboarding.types';

const getDeviceTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>({
    name: '',
    fitnessLevel: null,
    goals: [],
    targetAreas: [],
    availableEquipment: [],
    age: null,
    weight: null,
    height: null,
    workoutDays: [],
    preferredWorkoutTime: null,
    timezone: getDeviceTimezone(),
    physicalLimitations: [],
    notificationsEnabled: false,
  });

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setData({
      name: '',
      fitnessLevel: null,
      goals: [],
      targetAreas: [],
      availableEquipment: [],
      age: null,
      weight: null,
      height: null,
      workoutDays: [],
      preferredWorkoutTime: null,
      timezone: getDeviceTimezone(),
      physicalLimitations: [],
      notificationsEnabled: false,
    });
  }, []);

  return {
    data,
    updateData,
    resetData,
  };
}
