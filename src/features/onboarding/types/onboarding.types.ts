export interface OnboardingData {
  // Step 1: Name
  name: string;

  // Step 2: Fitness Level
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | null;

  // Step 3: Goals & Target Areas
  goals: string[];
  targetAreas: string[];

  // Step 4: Equipment
  availableEquipment: string[];

  // Step 5: Physical Stats
  age: number | null;
  weight: number | null;
  height: number | null;

  // Step 6: Schedule
  workoutDays: string[];
  preferredWorkoutTime: string | null;
  timezone: string;

  // Step 7: Limitations
  physicalLimitations: string[];

  // Step 8: Notifications
  notificationsEnabled: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<OnboardingStepProps>;
  isValid: (data: OnboardingData) => boolean;
  canSkip?: boolean;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}
