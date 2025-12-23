import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Alert,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import ScreenView from '@/components/screen-view';
import {
  useWorkoutSession,
  useCompleteWorkoutSession,
} from '@/features/workouts/hooks/use-workout-sessions';
import { useUpdateExerciseLog } from '@/features/workouts/hooks/use-exercise-logs';
import {
  X,
  SkipForward,
  SkipBack,
  Check,
  Info,
  Plus,
  Minus,
} from 'lucide-react-native';
import { cn } from '@/libs/utils';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
// import { Image } from 'expo-image';

type WorkoutState = 'get-ready' | 'exercise' | 'rest' | 'summary' | 'completed';

export default function WorkoutSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data: session, isLoading } = useWorkoutSession(sessionId);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('get-ready');
  const [timer, setTimer] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [exerciseAdjustments, setExerciseAdjustments] = useState<
    Record<string, { sets: number; reps: number }>
  >({});
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<number>(3);
  const [userNotes, setUserNotes] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { mutate: completeSession } = useCompleteWorkoutSession();
  const { mutate: updateExerciseLog } = useUpdateExerciseLog();

  const exercises = session?.exercise_logs || [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;

  // Initialize timer based on state
  useEffect(() => {
    if (workoutState === 'get-ready') {
      setTimer(5);
    } else if (workoutState === 'exercise') {
      setTimer(0);
    } else if (workoutState === 'rest') {
      setTimer(60);
    }
  }, [workoutState, currentExerciseIndex]);

  // Timer logic
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Don't run timer if completed
    if (workoutState === 'completed') {
      return;
    }

    if (workoutState === 'get-ready') {
      // Countdown from 5
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setWorkoutState('exercise');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (workoutState === 'exercise') {
      // Count up timer (always running during exercise)
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (workoutState === 'rest') {
      // Rest countdown
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleNextExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workoutState, currentExerciseIndex]);

  const handleDone = () => {
    // Mark exercise as completed with current timer and planned sets/reps
    if (currentExercise?.id) {
      updateExerciseLog({
        id: currentExercise.id,
        updates: {
          completed: true,
          duration_seconds: timer,
          sets_completed: currentExercise.sets_planned,
          reps_completed: currentExercise.reps_planned,
        },
      });

      // Initialize adjustment state with planned values
      setExerciseAdjustments((prev) => ({
        ...prev,
        [currentExercise.id]: {
          sets: currentExercise.sets_planned || 0,
          reps: currentExercise.reps_planned || 0,
        },
      }));
    }

    // Move to rest or next exercise
    if (currentExerciseIndex < totalExercises - 1) {
      setWorkoutState('rest');
    } else {
      // Last exercise done, go to summary
      setWorkoutState('summary');
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setWorkoutState('get-ready');
    } else {
      handleCompleteWorkout();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setWorkoutState('get-ready');
    }
  };

  const handleSkip = () => {
    if (workoutState === 'rest') {
      handleNextExercise();
    } else {
      Alert.alert(
        'Skip Exercise',
        'Are you sure you want to skip this exercise?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Skip',
            style: 'destructive',
            onPress: handleNextExercise,
          },
        ]
      );
    }
  };

  const handleAdjustExercise = (
    logId: string,
    field: 'sets' | 'reps',
    value: number
  ) => {
    setExerciseAdjustments((prev) => ({
      ...prev,
      [logId]: {
        sets: field === 'sets' ? value : (prev[logId]?.sets ?? 0),
        reps: field === 'reps' ? value : (prev[logId]?.reps ?? 0),
      },
    }));
  };

  const handleCompleteWorkout = async () => {
    if (!sessionId) return;

    // Apply all exercise adjustments
    for (const [logId, adjustment] of Object.entries(exerciseAdjustments)) {
      await updateExerciseLog({
        id: logId,
        updates: {
          sets_completed: adjustment.sets,
          reps_completed: adjustment.reps,
        },
      });
    }

    const durationMinutes = Math.round((Date.now() - sessionStartTime) / 60000);

    completeSession(
      {
        sessionId,
        durationMinutes,
        perceivedDifficulty,
        userNotes: userNotes || undefined,
      },
      {
        onSuccess: () => {
          setWorkoutState('completed');
        },
      }
    );
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Workout',
      'Are you sure you want to exit? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || !session) {
    return (
      <ScreenView className='items-center justify-center'>
        <Text className='text-muted-foreground'>Loading workout...</Text>
      </ScreenView>
    );
  }

  if (workoutState === 'completed') {
    return (
      <ScreenView className='items-center justify-center px-6'>
        <View className='bg-primary/20 w-24 h-24 rounded-full items-center justify-center mb-6'>
          <Check size={48} color='#a3e635' />
        </View>
        <Text className='text-4xl font-black uppercase mb-4'>
          Workout Complete!
        </Text>
        <Text className='text-muted-foreground text-center mb-8'>
          Great job! You've completed your workout.
        </Text>
        <Button
          onPress={() => router.push('/(tabs)')}
          size='lg'
          className='w-full'
        >
          <Text className='text-primary-foreground font-bold'>
            Back to Home
          </Text>
        </Button>
      </ScreenView>
    );
  }

  // Summary State
  if (workoutState === 'summary') {
    const completedExercises = exercises.filter((ex) => ex.completed);

    return (
      <ScreenView className='bg-background'>
        <ScrollView className='flex-1 px-6 pt-12 pb-6'>
          <Text className='text-3xl font-black uppercase mb-6'>
            Workout Summary
          </Text>
          <Text className='text-muted-foreground mb-8'>
            Review and adjust your completed exercises
          </Text>

          {/* Exercise Adjustments */}
          <View className='gap-4 mb-8'>
            {completedExercises.map((exercise) => {
              const adjustment = exerciseAdjustments[exercise.id] || {
                sets: exercise.sets_planned || 0,
                reps: exercise.reps_planned || 0,
              };

              return (
                <Surface key={exercise.id} className='p-4 rounded-lg'>
                  <Text className='font-bold text-base mb-4'>
                    {exercise.exercise?.name || 'Exercise'}
                  </Text>

                  <View className='flex flex-row gap-4'>
                    {/* Sets Adjustment */}
                    <View className='flex-1'>
                      <Text className='text-xs text-muted-foreground mb-2 uppercase'>
                        Sets
                      </Text>
                      <View className='flex flex-row items-center gap-2'>
                        <Pressable
                          onPress={() =>
                            handleAdjustExercise(
                              exercise.id,
                              'sets',
                              Math.max(0, adjustment.sets - 1)
                            )
                          }
                          className='bg-secondary w-10 h-10 rounded-lg items-center justify-center'
                        >
                          <Minus size={20} color='#ffffff' />
                        </Pressable>
                        <Text className='text-2xl font-bold flex-1 text-center'>
                          {adjustment.sets}
                        </Text>
                        <Pressable
                          onPress={() =>
                            handleAdjustExercise(
                              exercise.id,
                              'sets',
                              adjustment.sets + 1
                            )
                          }
                          className='bg-secondary w-10 h-10 rounded-lg items-center justify-center'
                        >
                          <Plus size={20} color='#ffffff' />
                        </Pressable>
                      </View>
                    </View>

                    {/* Reps Adjustment */}
                    <View className='flex-1'>
                      <Text className='text-xs text-muted-foreground mb-2 uppercase'>
                        Reps
                      </Text>
                      <View className='flex flex-row items-center gap-2'>
                        <Pressable
                          onPress={() =>
                            handleAdjustExercise(
                              exercise.id,
                              'reps',
                              Math.max(0, adjustment.reps - 1)
                            )
                          }
                          className='bg-secondary w-10 h-10 rounded-lg items-center justify-center'
                        >
                          <Minus size={20} color='#ffffff' />
                        </Pressable>
                        <Text className='text-2xl font-bold flex-1 text-center'>
                          {adjustment.reps}
                        </Text>
                        <Pressable
                          onPress={() =>
                            handleAdjustExercise(
                              exercise.id,
                              'reps',
                              adjustment.reps + 1
                            )
                          }
                          className='bg-secondary w-10 h-10 rounded-lg items-center justify-center'
                        >
                          <Plus size={20} color='#ffffff' />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Surface>
              );
            })}
          </View>

          {/* Perceived Difficulty */}
          <Surface className='p-4 rounded-lg mb-4'>
            <Text className='font-bold text-base mb-4'>
              How difficult was this workout?
            </Text>
            <View className='flex flex-row justify-between'>
              {[1, 2, 3, 4, 5].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setPerceivedDifficulty(level)}
                  className={cn(
                    'w-14 h-14 rounded-full items-center justify-center border-2',
                    perceivedDifficulty === level
                      ? 'bg-primary border-primary'
                      : 'bg-secondary border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-lg font-bold',
                      perceivedDifficulty === level
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className='flex flex-row justify-between mt-2'>
              <Text className='text-xs text-muted-foreground'>Easy</Text>
              <Text className='text-xs text-muted-foreground'>Hard</Text>
            </View>
          </Surface>

          {/* User Notes */}
          <Surface className='p-4 rounded-lg mb-8'>
            <Text className='font-bold text-base mb-4'>Notes (Optional)</Text>
            <TextInput
              value={userNotes}
              onChangeText={setUserNotes}
              placeholder='How did you feel? Any observations?'
              placeholderTextColor='#71717a'
              multiline
              numberOfLines={4}
              className='bg-background rounded-lg p-3 text-foreground min-h-24'
              style={{ textAlignVertical: 'top' }}
            />
          </Surface>

          {/* Complete Button */}
          <Button
            onPress={handleCompleteWorkout}
            size='lg'
            className='w-full mb-6'
          >
            <View className='flex flex-row items-center gap-2'>
              <Check size={20} color='#000000' />
              <Text className='text-primary-foreground font-bold text-lg'>
                Complete Workout
              </Text>
            </View>
          </Button>
        </ScrollView>
      </ScreenView>
    );
  }

  // Get Ready State
  if (workoutState === 'get-ready') {
    return (
      <ScreenView>
        <LinearGradient
          colors={['#3b82f6', '#1e3a8a']}
          className='absolute inset-0'
        />

        <View className='flex-1 px-6 pt-12'>
          {/* Header */}
          <View className='flex flex-row items-center justify-between mb-8'>
            <Pressable onPress={handleExit}>
              <X size={24} color='#ffffff' />
            </Pressable>
            <Text className='text-white font-bold'>
              Next {currentExerciseIndex + 1}/{totalExercises}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Exercise Preview */}
          <View className='flex-1 items-center justify-center'>
            <Text className='text-white text-5xl font-black mb-12'>
              Get Ready!
            </Text>

            <Text className='text-white text-2xl font-bold mb-8'>
              {currentExercise?.exercise?.name || 'Exercise'}
            </Text>

            {/* Countdown Circle */}
            <View className='relative w-48 h-48 items-center justify-center mb-12'>
              <Svg width={192} height={192} className='absolute'>
                <Circle
                  cx={96}
                  cy={96}
                  r={80}
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth={12}
                  fill='none'
                />
                <Circle
                  cx={96}
                  cy={96}
                  r={80}
                  stroke='#ffffff'
                  strokeWidth={12}
                  fill='none'
                  strokeDasharray={`${(timer / 5) * 502} 502`}
                  strokeDashoffset={0}
                  rotation='-90'
                  origin='96, 96'
                />
              </Svg>
              <Text className='text-white text-8xl font-black'>{timer}</Text>
            </View>
          </View>
        </View>
      </ScreenView>
    );
  }

  // Rest State
  if (workoutState === 'rest') {
    return (
      <ScreenView>
        <LinearGradient
          colors={['#3b82f6', '#1e3a8a']}
          className='absolute inset-0'
        />

        <View className='flex-1 px-6 pt-12'>
          {/* Header */}
          <View className='flex flex-row items-center justify-between mb-8'>
            <Pressable onPress={handleExit}>
              <X size={24} color='#ffffff' />
            </Pressable>
            <Text className='text-white font-bold'>
              Next {currentExerciseIndex + 2}/{totalExercises}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Rest Content */}
          <View className='flex-1 items-center justify-center'>
            {/* Next Exercise Preview */}
            {exercises[currentExerciseIndex + 1] && (
              <View className='bg-white rounded-3xl p-8 mb-8 w-full max-w-sm'>
                <Text className='text-gray-900 text-xl font-bold text-center'>
                  {exercises[currentExerciseIndex + 1].exercise?.name ||
                    'Next Exercise'}
                </Text>
              </View>
            )}

            <Text className='text-white text-xl mb-4'>Rest</Text>
            <Text className='text-white text-7xl font-black mb-12'>
              {formatTime(timer)}
            </Text>

            {/* Action Buttons */}
            <View className='flex flex-row gap-4'>
              <Pressable
                onPress={() => setTimer((prev) => prev + 10)}
                className='bg-transparent border-2 border-white rounded-full px-8 py-4'
              >
                <Text className='text-white font-bold'>+ 10s</Text>
              </Pressable>
              <Pressable
                onPress={handleSkip}
                className='bg-white rounded-full px-8 py-4'
              >
                <Text className='text-gray-900 font-bold'>Skip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenView>
    );
  }

  // Exercise State
  const isRepBased =
    currentExercise?.reps_planned && !currentExercise?.duration_seconds;

  return (
    <ScreenView className='bg-background'>
      <View className='flex-1 px-6 pt-12 pb-6'>
        {/* Header */}
        <View className='flex flex-row items-center justify-between mb-8'>
          <Pressable onPress={handleExit}>
            <X size={24} color='#ffffff' />
          </Pressable>
          <View className='flex-1 h-1 bg-border rounded-full mx-4 overflow-hidden'>
            <View
              className='h-full bg-primary'
              style={{
                width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%`,
              }}
            />
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Main Content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-1 items-center justify-center py-8'>
            {/* Exercise Image */}
            {currentExercise?.exercise?.demo_gif_url && (
              <View className='w-full max-w-sm aspect-square bg-muted rounded-3xl overflow-hidden mb-8'>
                <Image
                  source={{ uri: currentExercise.exercise.demo_gif_url }}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              </View>
            )}

            {/* Exercise Name */}
            <View className='flex flex-row items-center gap-2 mb-8'>
              <Text className='text-xl font-bold text-center'>
                {currentExercise?.exercise?.name || 'Exercise'}
              </Text>
              <Info size={18} color='#71717a' />
            </View>

            {/* Timer/Reps Display */}
            {isRepBased ? (
              <Text className='text-8xl font-black mb-12'>
                X{currentExercise.reps_planned}
              </Text>
            ) : (
              <Text className='text-8xl font-black mb-12'>
                {formatTime(timer)}
              </Text>
            )}

            {/* DONE Button */}
            <View className='w-full px-4 mb-8'>
              <Button onPress={handleDone} size='lg' className='w-full'>
                <View className='flex flex-row items-center gap-2'>
                  <Text className='text-primary-foreground font-bold text-lg'>
                    DONE
                  </Text>
                  <Check size={20} color='#000000' />
                </View>
              </Button>
            </View>

            {/* Navigation */}
            <View className='flex flex-row items-center justify-between w-full px-4'>
              <Pressable
                onPress={handlePreviousExercise}
                disabled={currentExerciseIndex === 0}
                className='flex flex-row items-center gap-2 px-6 py-3 bg-secondary rounded-lg'
              >
                <SkipBack
                  size={20}
                  color={currentExerciseIndex === 0 ? '#3f3f46' : '#3b82f6'}
                />
                <Text
                  className={cn(
                    'font-bold',
                    currentExerciseIndex === 0
                      ? 'text-muted-foreground'
                      : 'text-primary'
                  )}
                >
                  Previous
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSkip}
                className='flex flex-row items-center gap-2 px-6 py-3 bg-secondary rounded-lg'
              >
                <Text className='text-primary font-bold'>Skip</Text>
                <SkipForward size={20} color='#3b82f6' />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenView>
  );
}
