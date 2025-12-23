import React, { useState } from 'react';
import { ScreenScrollView } from '@/components/screen-scroll-view';
import { Text } from '@/components/text';
import { View, Pressable, ScrollView, Alert, ColorValue } from 'react-native';
import { Surface } from '@/components/surface';
import { Button } from '@/components/button';
import { BottomSheet, useBottomSheet } from '@/components/bottom-sheet';
import {
  useSystemTemplates,
  useSystemTemplate,
  useUserTemplates,
  useUserTemplate,
  useStartSessionFromTemplate,
  useCloneSystemTemplate,
} from '@/features/workouts/hooks/use-workout-templates';
import {
  SystemWorkoutTemplate,
  UserWorkoutTemplate,
} from '@/libs/supabase/types/database.types';
import { useAuth } from '@/providers/auth-provider';
import { router } from 'expo-router';
import { cn } from '@/libs/utils';
import {
  parseGradientColors,
  parseGradientDirection,
} from '@/libs/utils/gradient-parser';
import {
  Dumbbell,
  Clock,
  Target,
  Play,
  Heart,
  Plus,
  Loader2,
} from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';

type WorkoutFilter = 'user' | 'favorites' | 'kelp';

export default function WorkoutsScreen() {
  const [workoutFilter, setWorkoutFilter] = useState<WorkoutFilter>('user');

  const { data: userWorkouts, isLoading: userWorkoutsLoading } =
    useUserTemplates({
      isFavorite: workoutFilter === 'favorites' ? true : undefined,
    });

  const { data: kelpWorkouts, isLoading: kelpWorkoutsLoading } =
    useSystemTemplates();

  const selectedWorkouts =
    workoutFilter === 'kelp' ? kelpWorkouts : userWorkouts;
  const isLoading =
    workoutFilter === 'kelp' ? kelpWorkoutsLoading : userWorkoutsLoading;

  return (
    <ScreenScrollView className='pt-12 pb-24'>
      <View className='flex flex-row items-center justify-between mb-6'>
        <Text className='text-3xl font-black uppercase'>Library</Text>
        {/* TODO: Add CreateTemplateDialog */}
        <Button size='icon' variant='ghost'>
          <Plus size={24} color='#ffffff' />
        </Button>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='mb-6 -mx-4 px-4'
        contentContainerStyle={{ gap: 8 }}
      >
        <Pressable
          onPress={() => setWorkoutFilter('user')}
          className={cn(
            'px-4 py-2 rounded-full transition-colors',
            workoutFilter === 'user'
              ? 'bg-primary'
              : 'bg-card border border-border'
          )}
        >
          <Text
            className={cn(
              'font-bold text-xs whitespace-nowrap',
              workoutFilter === 'user'
                ? 'text-primary-foreground'
                : 'text-foreground'
            )}
          >
            My Workouts
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setWorkoutFilter('favorites')}
          className={cn(
            'px-4 py-2 rounded-full transition-colors',
            workoutFilter === 'favorites'
              ? 'bg-primary'
              : 'bg-card border border-border'
          )}
        >
          <Text
            className={cn(
              'font-bold text-xs whitespace-nowrap',
              workoutFilter === 'favorites'
                ? 'text-primary-foreground'
                : 'text-foreground'
            )}
          >
            Favorites
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setWorkoutFilter('kelp')}
          className={cn(
            'px-4 py-2 rounded-full transition-colors',
            workoutFilter === 'kelp'
              ? 'bg-primary'
              : 'bg-card border border-border'
          )}
        >
          <Text
            className={cn(
              'font-bold text-xs whitespace-nowrap',
              workoutFilter === 'kelp'
                ? 'text-primary-foreground'
                : 'text-foreground'
            )}
          >
            Kelp
          </Text>
        </Pressable>
      </ScrollView>

      {/* Workouts List */}
      <View className='gap-4'>
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <View
                key={i}
                className='h-48 rounded-2xl bg-card animate-pulse'
              />
            ))}
          </>
        ) : selectedWorkouts && selectedWorkouts.length > 0 ? (
          selectedWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isSystemTemplate={workoutFilter === 'kelp'}
            />
          ))
        ) : (
          <Surface className='p-8 items-center'>
            <Dumbbell size={48} color='#71717a' className='mb-4' />
            <Text className='text-lg font-bold mb-2'>No workouts found</Text>
            <Text className='text-muted-foreground text-center'>
              {workoutFilter === 'favorites'
                ? 'No favorite workouts yet'
                : workoutFilter === 'kelp'
                  ? 'No Kelp templates available'
                  : 'Create your first workout template'}
            </Text>
          </Surface>
        )}
      </View>
    </ScreenScrollView>
  );
}

function WorkoutCard({
  workout,
  isSystemTemplate,
}: {
  workout: SystemWorkoutTemplate | UserWorkoutTemplate;
  isSystemTemplate: boolean;
}) {
  const { isVisible, open, close } = useBottomSheet();
  const { user } = useAuth();

  // Fetch full template with exercises when dialog opens
  const { data: systemTemplateDetail } = useSystemTemplate(
    isSystemTemplate && isVisible ? workout.id : undefined
  );
  const { data: userTemplateDetail } = useUserTemplate(
    !isSystemTemplate && isVisible ? workout.id : undefined
  );

  const templateDetail = isSystemTemplate
    ? systemTemplateDetail
    : userTemplateDetail;

  const { mutate: startSession, isPending: isStarting } =
    useStartSessionFromTemplate();
  const { mutate: cloneTemplate, isPending: isCloning } =
    useCloneSystemTemplate();

  const handleStartWorkout = () => {
    if (!user?.id || !workout.id) return;

    if (isSystemTemplate) {
      // For system templates: Clone first, then create session from cloned template
      cloneTemplate(
        {
          systemTemplateId: workout.id,
          userId: user.id,
        },
        {
          onSuccess: (clonedTemplateId) => {
            // Now create session from the cloned user template
            startSession(
              {
                userTemplateId: clonedTemplateId,
                userId: user.id,
              },
              {
                onSuccess: (sessionId) => {
                  close();
                  router.push(`/workout/${sessionId}`);
                },
              }
            );
          },
        }
      );
    } else {
      // For user templates: Create session directly
      startSession(
        {
          userTemplateId: workout.id,
          userId: user.id,
        },
        {
          onSuccess: (sessionId) => {
            close();
            router.push(`/workout/${sessionId}`);
          },
        }
      );
    }
  };

  const getIntensityColor = (intensity?: string) => {
    switch (intensity) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const gradientColors = parseGradientColors(workout.color);
  const gradientDirection = parseGradientDirection(workout.color);

  return (
    <>
      <Pressable onPress={open}>
        <Surface className='relative overflow-hidden rounded-2xl p-4 h-48 justify-start'>
          <LinearGradient
            colors={gradientColors as any}
            start={gradientDirection.start}
            end={gradientDirection.end}
            className='absolute inset-0 rounded-2xl'
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              pointerEvents: 'none',
            }}
          />

          {/* overlay */}
          <View className='absolute inset-0 bg-black/30' />

          {/* Content */}
          <View className='relative z-10 '>
            <View className='flex flex-row gap-2 mb-3 flex-wrap'>
              {workout.intensity && (
                <View
                  className={cn(
                    'px-2 py-1 rounded',
                    getIntensityColor(workout.intensity)
                  )}
                >
                  <Text className='text-[10px] font-bold uppercase tracking-wider'>
                    {workout.intensity}
                  </Text>
                </View>
              )}
              {workout.estimated_duration_minutes && (
                <View className='px-2 py-1 rounded bg-black/30'>
                  <Text className='text-[10px] font-bold uppercase tracking-wider'>
                    {workout.estimated_duration_minutes} min
                  </Text>
                </View>
              )}
            </View>

            <Text className='text-2xl font-black uppercase mb-1'>
              {workout.title}
            </Text>

            {workout.description && (
              <Text
                className='text-foreground text-sm'
                numberOfLines={2}
                ellipsizeMode='tail'
              >
                {workout.description}
              </Text>
            )}
          </View>
        </Surface>
      </Pressable>

      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title={workout.title}
        snapPoints={[0.9]}
      >
        <ScrollView
          className='flex-1 -mx-4'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='px-4'>
            {/* Description */}
            {workout.description && (
              <Text className='text-muted-foreground mb-6'>
                {workout.description}
              </Text>
            )}

            {/* Stats */}
            <View className='flex flex-row gap-2 mb-6 flex-wrap'>
              {workout.intensity && (
                <View
                  className={cn(
                    'px-3 py-2 rounded-lg',
                    getIntensityColor(workout.intensity)
                  )}
                >
                  <Text className='text-xs font-bold uppercase'>
                    {workout.intensity}
                  </Text>
                </View>
              )}
              {workout.estimated_duration_minutes && (
                <Surface className='px-3 py-2 rounded-lg flex flex-row items-center gap-2'>
                  <Clock size={14} color='#71717a' />
                  <Text className='text-xs font-bold'>
                    {workout.estimated_duration_minutes} min
                  </Text>
                </Surface>
              )}
              {workout.focus_area && (
                <Surface className='px-3 py-2 rounded-lg flex flex-row items-center gap-2'>
                  <Target size={14} color='#71717a' />
                  <Text className='text-xs font-bold uppercase'>
                    {workout.focus_area}
                  </Text>
                </Surface>
              )}
            </View>

            {/* Exercises */}
            <Text className='font-bold uppercase text-sm mb-4'>
              Workout Structure
            </Text>

            {templateDetail?.exercises &&
            templateDetail.exercises.length > 0 ? (
              <View className='gap-3 mb-6'>
                {templateDetail.exercises.map((ex: any, idx: number) => (
                  <Surface key={ex.id} className='p-4 rounded-lg'>
                    <View className='flex flex-row items-start justify-between mb-2'>
                      <View className='flex-1'>
                        <Text className='font-bold text-base mb-1'>
                          {ex.exercise?.name || 'Exercise'}
                        </Text>
                        {ex.exercise?.primary_muscles && (
                          <Text className='text-xs text-muted-foreground uppercase'>
                            {ex.exercise.primary_muscles.join(' • ')}
                          </Text>
                        )}
                      </View>
                      <View className='bg-primary/20 w-8 h-8 rounded-full items-center justify-center'>
                        <Text className='text-primary font-bold text-xs'>
                          {idx + 1}
                        </Text>
                      </View>
                    </View>

                    {/* Sets/Reps Info */}
                    <View className='flex flex-row gap-4 mt-2'>
                      {ex.sets && (
                        <Text className='text-sm text-muted-foreground'>
                          {ex.sets} sets
                        </Text>
                      )}
                      {ex.reps && (
                        <Text className='text-sm text-muted-foreground'>
                          {ex.reps} reps
                        </Text>
                      )}
                      {ex.duration_seconds && (
                        <Text className='text-sm text-muted-foreground'>
                          {ex.duration_seconds}s
                        </Text>
                      )}
                    </View>

                    {ex.notes && (
                      <Text className='text-xs text-muted-foreground mt-2'>
                        {ex.notes}
                      </Text>
                    )}
                  </Surface>
                ))}
              </View>
            ) : (
              <Surface className='p-6 items-center mb-6'>
                <Text className='text-muted-foreground text-sm'>
                  No exercises added yet
                </Text>
              </Surface>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className='px-4 pt-4 gap-3'>
          <Button
            onPress={handleStartWorkout}
            disabled={isStarting || isCloning}
            size='lg'
            className='w-full'
          >
            {isStarting || isCloning ? (
              <View className='flex flex-row items-center gap-2'>
                <Loader2 size={20} color='#000000' className='animate-spin' />
                <Text className='text-primary-foreground font-bold'>
                  Starting...
                </Text>
              </View>
            ) : (
              <View className='flex flex-row items-center gap-2'>
                <Play size={20} color='#000000' fill='#000000' />
                <Text className='text-primary-foreground font-bold'>
                  Start Workout
                </Text>
              </View>
            )}
          </Button>

          {isSystemTemplate && (
            <Text className='text-xs text-muted-foreground text-center'>
              This will clone the template to your library before starting
            </Text>
          )}
        </View>
      </BottomSheet>
    </>
  );
}
