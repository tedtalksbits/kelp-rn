import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import { Input } from '@/components/input';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/libs/utils';
import {
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  Search,
  Loader2,
  Edit,
} from 'lucide-react-native';
import { useBottomSheet } from '@/components/bottom-sheet';
import { BottomSheet } from '@/components/bottom-sheet';
import type {
  KelpBodyPart,
  KelpFitnessLevel,
} from '@/libs/supabase/types/database.types';
import {
  useCreateUserTemplate,
  useUpdateUserTemplate,
  useUserTemplate,
} from '../hooks/use-workout-templates';
import {
  useCreateTemplateExercise,
  useUpdateTemplateExercise,
  useDeleteTemplateExercise,
} from '../hooks/use-workout-templates';
import { useExercises } from '../hooks/use-exercises';
import type { Exercise } from '@/libs/supabase/types/database.types';
import { useHaptics } from '@/components/use-haptics';
import { GlassView } from 'expo-glass-effect';
import { withUniwind } from 'uniwind';
import HeroImage from '../../../../assets/hero.png';

interface SelectedExercise {
  id?: string; // For existing exercises
  exercise: Exercise;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
  order_index: number;
}

const FOCUS_AREAS: { value: KelpBodyPart; label: string }[] = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
];

const DIFFICULTY_LEVELS: { value: KelpFitnessLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const STEPS = [
  { title: 'Details', description: 'Template info' },
  { title: 'Exercises', description: 'Add exercises' },
  { title: 'Review', description: 'Confirm & create' },
];

interface CreateTemplateDialogProps {
  trigger?: React.ReactElement;
  templateId?: string; // If provided, edit mode
  onSuccess?: () => void;
}

const StyledPlusIcon = withUniwind(Plus);

export function CreateTemplateDialog({
  trigger,
  templateId,
  onSuccess,
}: CreateTemplateDialogProps) {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const { data: exercises, isLoading: exercisesLoading } = useExercises();
  const { data: existingTemplate } = useUserTemplate(templateId);

  const createTemplate = useCreateUserTemplate();
  const updateTemplate = useUpdateUserTemplate();
  const createTemplateExercise = useCreateTemplateExercise();
  const updateTemplateExercise = useUpdateTemplateExercise();
  const deleteTemplateExercise = useDeleteTemplateExercise();
  const haptics = useHaptics();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [focusArea, setFocusArea] = useState<KelpBodyPart>('full_body');
  const [difficultyLevel, setDifficultyLevel] =
    useState<KelpFitnessLevel>('beginner');
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [exerciseSheetVisible, setExerciseSheetVisible] = useState(false);

  const isEditMode = !!templateId;

  // Load existing template data
  useEffect(() => {
    if (existingTemplate && isEditMode) {
      setTitle(existingTemplate.title);
      setDescription(existingTemplate.description || '');
      setFocusArea(existingTemplate.focus_area || 'full_body');
      setEstimatedDuration(existingTemplate.estimated_duration_minutes || 30);

      if (existingTemplate.exercises) {
        setSelectedExercises(
          existingTemplate.exercises.map((ex) => ({
            id: ex.id,
            exercise: ex.exercise!,
            sets: ex.target_sets || 3,
            reps: ex.target_reps || 10,
            rest_seconds: ex.rest_seconds || 60,
            notes: ex.notes || '',
            order_index: ex.order_index || 0,
          }))
        );
      }
    }
  }, [existingTemplate, isEditMode]);

  const filteredExercises = exercises?.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.target_muscle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise,
        sets: 3,
        reps: 10,
        rest_seconds: 60,
        notes: '',
        order_index: selectedExercises.length,
      },
    ]);
    setSearchQuery('');
    haptics.selection();
    setExerciseSheetVisible(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (
    index: number,
    field: 'sets' | 'reps' | 'rest_seconds' | 'notes',
    value: string | number
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedExercises.length) return;

    const updated = [...selectedExercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Update order_index
    updated.forEach((ex, i) => {
      ex.order_index = i;
    });

    setSelectedExercises(updated);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setTitle('');
    setDescription('');
    setFocusArea('full_body');
    setDifficultyLevel('beginner');
    setEstimatedDuration(30);
    setSelectedExercises([]);
    setSearchQuery('');
  };

  const handleNext = () => {
    if (currentStep === 0 && !title.trim()) {
      Alert.alert('Error', 'Please enter a template title');
      return;
    }
    if (currentStep === 1 && selectedExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    if (!user || selectedExercises.length === 0) return;

    setIsCreating(true);
    try {
      let templateIdToUse = templateId;

      if (isEditMode && templateId) {
        // Update existing template
        await updateTemplate.mutateAsync({
          id: templateId,
          updates: {
            title,
            description: description || null,
            focus_area: focusArea,
            estimated_duration_minutes: estimatedDuration,
          },
        });

        // Handle exercises: delete removed, update existing, create new
        const existingExerciseIds =
          existingTemplate?.exercises?.map((ex) => ex.id) || [];
        const currentExerciseIds = selectedExercises
          .map((ex) => ex.id)
          .filter(Boolean);

        // Delete removed exercises
        for (const exId of existingExerciseIds) {
          if (!currentExerciseIds.includes(exId)) {
            await deleteTemplateExercise.mutateAsync({ id: exId, templateId });
          }
        }

        // Update or create exercises
        for (let i = 0; i < selectedExercises.length; i++) {
          const { id, exercise, sets, reps, rest_seconds, notes } =
            selectedExercises[i];

          if (id) {
            // Update existing
            await updateTemplateExercise.mutateAsync({
              id,
              updates: {
                target_sets: sets,
                target_reps: reps,
                rest_seconds,
                notes: notes || null,
                order_index: i,
              },
            });
          } else {
            // Create new
            await createTemplateExercise.mutateAsync({
              template_id: templateId,
              exercise_id: exercise.id,
              target_reps: reps,
              target_sets: sets,
              rest_seconds,
              notes: notes || null,
              order_index: i,
            });
          }
        }
      } else {
        // Create new template
        const template = await createTemplate.mutateAsync({
          user_id: user.id,
          title,
          description: description || null,
          focus_area: focusArea,
          estimated_duration_minutes: estimatedDuration,
          estimated_calories: 0,
          is_ai_generated: false,
          is_favorite: false,
        });

        templateIdToUse = template.id;

        // Create exercises
        for (let i = 0; i < selectedExercises.length; i++) {
          const { exercise, sets, reps, rest_seconds, notes } =
            selectedExercises[i];
          await createTemplateExercise.mutateAsync({
            template_id: template.id,
            exercise_id: exercise.id,
            target_reps: reps,
            target_sets: sets,
            rest_seconds,
            notes: notes || null,
            order_index: i,
          });
        }
      }

      Alert.alert(
        'Success',
        `Template ${isEditMode ? 'updated' : 'created'} successfully!`
      );

      resetForm();
      setVisible(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save template:', error);
      Alert.alert('Error', 'Failed to save template');
    } finally {
      setIsCreating(false);
    }
  };

  const triggerEl = React.cloneElement(
    trigger ?? (
      <Pressable
        onPress={() => {
          setVisible(true);
          haptics.light();
        }}
        accessibilityRole='button'
        accessibilityLabel='Add quote'
      >
        <GlassView style={{ padding: 8, borderRadius: 9999 }}>
          <StyledPlusIcon size={24} className='text-foreground' />
        </GlassView>
      </Pressable>
    ),
    {
      onPress: () => {
        setVisible(true);
        haptics.light();
      },
    }
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Step 1: Template Details
        return (
          <View className='gap-6 px-4'>
            <View className='gap-2'>
              <Text className='text-sm font-medium'>Workout Name</Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder='e.g., Upper Body Strength'
                className='text-foreground'
              />
            </View>

            <View className='gap-2'>
              <Text className='text-sm font-medium'>Description</Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder='Describe this workout template...'
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: 'top' }}
                className='text-foreground'
              />
            </View>

            <View className='gap-2'>
              <Text className='text-sm font-medium'>Focus Area</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {FOCUS_AREAS.map((area) => (
                  <Pressable
                    key={area.value}
                    onPress={() => setFocusArea(area.value)}
                  >
                    <Surface
                      className={cn(
                        'px-4 py-2 border-2',
                        focusArea === area.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-bold text-sm uppercase tracking-wide',
                          focusArea === area.value
                            ? 'text-primary'
                            : 'text-foreground'
                        )}
                      >
                        {area.label}
                      </Text>
                    </Surface>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View className='gap-2'>
              <Text className='text-sm font-medium'>
                Estimated Duration (minutes)
              </Text>
              <Input
                value={estimatedDuration.toString()}
                onChangeText={(text) =>
                  setEstimatedDuration(parseInt(text) || 0)
                }
                keyboardType='numeric'
                placeholder='30'
                className='text-foreground'
              />
            </View>
          </View>
        );

      case 1:
        // Step 2: Add Exercises
        return (
          <View className='gap-4 px-4'>
            {/* Selected Exercises */}
            {selectedExercises.length === 0 && (
              <View className='items-center py-8'>
                <Text className='text-muted-foreground text-sm'>
                  No exercises added yet.
                </Text>
              </View>
            )}
            {selectedExercises.length > 0 && (
              <View className='gap-3'>
                <Text className='text-sm font-medium'>
                  Selected Exercises ({selectedExercises.length})
                </Text>
                <ScrollView
                  className='flex-1'
                  showsVerticalScrollIndicator={false}
                >
                  {selectedExercises.map((item, index) => (
                    <Surface key={index} className='p-3 mb-3'>
                      <View className='flex flex-row items-start gap-3'>
                        {/* Reorder Buttons */}
                        <View className='gap-1'>
                          <Pressable
                            onPress={() => handleMoveExercise(index, 'up')}
                            disabled={index === 0}
                          >
                            <Surface
                              className={cn(
                                'w-8 h-8 items-center justify-center',
                                index === 0 && 'opacity-30'
                              )}
                            >
                              <ChevronUp size={16} color='#ffffff' />
                            </Surface>
                          </Pressable>
                          <Pressable
                            onPress={() => handleMoveExercise(index, 'down')}
                            disabled={index === selectedExercises.length - 1}
                          >
                            <Surface
                              className={cn(
                                'w-8 h-8 items-center justify-center',
                                index === selectedExercises.length - 1 &&
                                  'opacity-30'
                              )}
                            >
                              <ChevronDown size={16} color='#ffffff' />
                            </Surface>
                          </Pressable>
                        </View>

                        {/* Exercise Details */}
                        <View className='flex-1 gap-2'>
                          <Text className='font-bold'>
                            {item.exercise.name}
                          </Text>
                          <View className='flex flex-row gap-2'>
                            <View className='flex-1'>
                              <Text className='text-xs text-muted-foreground mb-1'>
                                Sets
                              </Text>
                              <Input
                                value={item.sets.toString()}
                                onChangeText={(text) =>
                                  handleUpdateExercise(
                                    index,
                                    'sets',
                                    parseInt(text) || 0
                                  )
                                }
                                keyboardType='numeric'
                                className='text-center'
                              />
                            </View>
                            <View className='flex-1'>
                              <Text className='text-xs text-muted-foreground mb-1'>
                                Reps
                              </Text>
                              <Input
                                value={item.reps.toString()}
                                onChangeText={(text) =>
                                  handleUpdateExercise(
                                    index,
                                    'reps',
                                    parseInt(text) || 0
                                  )
                                }
                                keyboardType='numeric'
                                className='text-center'
                              />
                            </View>
                            <View className='flex-1'>
                              <Text className='text-xs text-muted-foreground mb-1'>
                                Rest (s)
                              </Text>
                              <Input
                                value={item.rest_seconds.toString()}
                                onChangeText={(text) =>
                                  handleUpdateExercise(
                                    index,
                                    'rest_seconds',
                                    parseInt(text) || 0
                                  )
                                }
                                keyboardType='numeric'
                                className='text-center'
                              />
                            </View>
                          </View>
                        </View>

                        {/* Remove Button */}
                        <Pressable onPress={() => handleRemoveExercise(index)}>
                          <Surface className='w-8 h-8 items-center justify-center bg-destructive/20'>
                            <Trash2 size={16} color='#ef4444' />
                          </Surface>
                        </Pressable>
                      </View>
                    </Surface>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Add Exercise Button */}
            <Button
              size='lg'
              variant='accent'
              onPress={() => setExerciseSheetVisible(true)}
              className='w-full'
            >
              <View className='flex flex-row items-center gap-2'>
                <Plus size={20} color='#ffffff' />
                <Text className='text-foreground font-bold text-lg'>
                  Add Exercise
                </Text>
              </View>
            </Button>

            {/* Exercise Selection Sheet */}
            <Modal
              visible={exerciseSheetVisible}
              onRequestClose={() => setExerciseSheetVisible(false)}
              animationType='slide'
              presentationStyle='pageSheet'
            >
              <View className='flex-1 bg-popover'>
                <View className='flex flex-row gap-2 justify-between items-center px-4 py-3 border-b border-border'>
                  {/* Search */}
                  <View className='relative flex-1'>
                    <View className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                      <Search size={16} color='#71717a' />
                    </View>
                    <Input
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder='Search by name or muscle...'
                      className='pl-10'
                    />
                  </View>
                  {/* Close Button */}
                  <Button
                    size='sm'
                    variant='ghost'
                    onPress={() => setExerciseSheetVisible(false)}
                  >
                    <Text>Close</Text>
                  </Button>
                </View>

                {/* Exercise List */}
                <ScrollView
                  className='flex-1 mt-4 px-4'
                  showsVerticalScrollIndicator={false}
                >
                  {exercisesLoading ? (
                    <View className='items-center py-8'>
                      <Loader2
                        size={32}
                        color='#a3e635'
                        className='animate-spin'
                      />
                    </View>
                  ) : filteredExercises && filteredExercises.length > 0 ? (
                    <View className='gap-2'>
                      {filteredExercises.slice(0, 50).map((exercise, idx) => {
                        const isSelected = selectedExercises.some(
                          (ex) => ex.exercise.id === exercise.id
                        );
                        return (
                          <Pressable
                            key={exercise.id}
                            onPress={() =>
                              !isSelected && handleAddExercise(exercise)
                            }
                            disabled={isSelected}
                          >
                            <Surface
                              className={cn(
                                'p-0 rounded-none bg-transparent',
                                // isSelected && 'opacity-50 bg-muted'
                                {
                                  'opacity-50': isSelected,
                                  'pb-3 border-b border-border':
                                    idx !== filteredExercises.length - 1,
                                  'pb-0': idx === filteredExercises.length - 1,
                                }
                              )}
                            >
                              {/* <View className='flex flex-row items-start gap-3'>
                                <View className='flex-1'>
                                  <Text className='font-bold mb-1'>
                                    {exercise.name}
                                  </Text>
                                  <Text className='text-xs text-muted-foreground uppercase'>
                                    {exercise.target_muscle}
                                  </Text>
                                  {exercise.description && (
                                    <Text
                                      className='text-xs text-muted-foreground mt-1'
                                      numberOfLines={2}
                                    >
                                      {exercise.description}
                                    </Text>
                                  )}
                                </View>
                                {isSelected && (
                                  <View className='bg-primary/20 px-2 py-1 rounded'>
                                    <Text className='text-primary text-xs font-bold'>
                                      Added
                                    </Text>
                                  </View>
                                )}
                              </View> */}
                              <View className='flex flex-row items-start justify-between gap-4'>
                                <View className='rounded-xs overflow-hidden'>
                                  <Image
                                    source={
                                      exercise?.demo_gif_url
                                        ? { uri: exercise.demo_gif_url }
                                        : HeroImage
                                    }
                                    style={{
                                      width: 65,
                                      height: 65,
                                      borderRadius: 8,
                                    }}
                                  />
                                </View>
                                <View className='flex-1 gap-1'>
                                  <Text className='font-bold uppercase text-base'>
                                    {exercise?.name || 'Exercise'}
                                  </Text>
                                  {exercise.description && (
                                    <Text
                                      className='text-xs text-muted-foreground mt-1'
                                      numberOfLines={2}
                                    >
                                      {exercise.description}
                                    </Text>
                                  )}

                                  <View className='flex flex-row items-center gap-2'>
                                    {exercise?.target_muscle && (
                                      <Text className='text-xs text-muted-foreground uppercase font-bold'>
                                        {exercise.target_muscle}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                                {isSelected && (
                                  <View className='bg-primary/20 px-2 py-1 rounded'>
                                    <Text className='text-primary text-xs font-bold'>
                                      Added
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </Surface>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <View className='items-center py-8'>
                      <Text className='text-muted-foreground text-sm'>
                        {searchQuery
                          ? 'No exercises found'
                          : 'Start typing to search'}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Modal>
          </View>
        );

      case 2:
        // Step 3: Review
        return (
          <View className='gap-4 px-4'>
            <Surface className='p-4 bg-muted/50'>
              <Text className='font-bold text-lg mb-2'>{title}</Text>
              {description && (
                <Text className='text-sm text-muted-foreground mb-2'>
                  {description}
                </Text>
              )}
              <View className='flex flex-row gap-4 text-sm flex-wrap'>
                <Text className='text-muted-foreground'>
                  Focus: {focusArea.replace('_', ' ')}
                </Text>
                <Text className='text-muted-foreground'>
                  Duration: ~{estimatedDuration} min
                </Text>
                <Text className='text-muted-foreground'>
                  Exercises: {selectedExercises.length}
                </Text>
              </View>
            </Surface>

            <View>
              <Text className='text-sm font-medium mb-2'>
                Exercises ({selectedExercises.length})
              </Text>
              <ScrollView
                className='max-h-96'
                showsVerticalScrollIndicator={false}
              >
                {selectedExercises.map((item, index) => (
                  <Surface key={index} className='p-3 mb-2'>
                    <Text className='font-bold mb-1'>
                      {index + 1}. {item.exercise.name}
                    </Text>
                    <Text className='text-sm text-muted-foreground'>
                      {item.sets} sets × {item.reps} reps · {item.rest_seconds}s
                      rest
                    </Text>
                  </Surface>
                ))}
              </ScrollView>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {triggerEl}

      <Modal
        visible={visible}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View className='flex-1 bg-popover'>
          {/* Header */}
          <View className='flex flex-row gap-2 justify-between items-center px-4 py-3 border-b border-border'>
            {currentStep === 0 ? (
              <Button
                size='sm'
                variant='ghost'
                onPress={() => {
                  resetForm();
                  setVisible(false);
                }}
              >
                <Text>Cancel</Text>
              </Button>
            ) : (
              <Button size='sm' variant='ghost' onPress={handleBack}>
                <Text>Back</Text>
              </Button>
            )}

            <Text className='text-lg font-bold uppercase'>
              {isEditMode ? 'Edit' : 'New'} Workout
            </Text>

            {currentStep < STEPS.length - 1 ? (
              <Button size='sm' variant='ghost' onPress={handleNext}>
                <Text className='text-primary'>Next</Text>
              </Button>
            ) : (
              <Button
                size='sm'
                variant='ghost'
                onPress={handleSave}
                disabled={isCreating}
              >
                {isCreating ? (
                  <View className='flex flex-row items-center gap-2'>
                    <Loader2
                      size={16}
                      color='#a3e635'
                      className='animate-spin'
                    />
                    <Text className='text-primary'>Saving...</Text>
                  </View>
                ) : (
                  <Text className='text-primary'>Save</Text>
                )}
              </Button>
            )}
          </View>

          {/* Step Indicator */}
          <View className='flex flex-row justify-center items-center gap-2 py-4 border-b border-border'>
            {STEPS.map((step, index) => (
              <View key={index} className='flex flex-row items-center gap-2'>
                <View
                  className={cn(
                    'w-8 h-8 rounded-full items-center justify-center',
                    index <= currentStep
                      ? 'bg-primary'
                      : 'bg-muted border-2 border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-bold text-sm',
                      index <= currentStep
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View
                    className={cn(
                      'w-8 h-0.5',
                      index < currentStep ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Content */}
          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            {renderStepContent()}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
