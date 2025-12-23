'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Edit, Loader2, Plus, User as UserIcon, X } from 'lucide-react-native';
import {
  useProfile,
  useUpdateProfile,
} from '@/features/user-profile/hooks/use-profile';
import { AgeSelectorSheet } from '@/components/age-selector-sheet';
import { HeightSelectorSheet } from '@/components/height-selector-sheet';
import { WeightSelectorSheet } from '@/components/weight-selector-sheet';
import { GymEquipmentSelectorSheet } from '@/components/gym-equipment-selector-sheet';
import type {
  KelpFitnessLevel,
  KelpBodyPart,
} from '@/libs/supabase/types/database.types';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { View, Pressable, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/text';
import { cn } from '@/libs/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarUpload } from './avatar-upload';
import { useHaptics } from '@/components/use-haptics';
import { withUniwind } from 'uniwind';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
const PHYSICAL_LIMITATIONS = [
  'Knee issues',
  'Back pain',
  'Shoulder problems',
  'Wrist pain',
  'Ankle weakness',
  'Hip mobility',
  'Neck stiffness',
  'Balance issues',
];

const fitnessLevels: {
  value: KelpFitnessLevel;
  label: string;
  desc: string;
}[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'beginner', label: 'Beginner', desc: 'New to working out' },
  {
    value: 'intermediate',
    label: 'Intermediate',
    desc: 'Regular exercise routine',
  },
  { value: 'advanced', label: 'Advanced', desc: 'Experienced athlete' },
];

const goalOptions = [
  'Build Muscle',
  'Lose Weight',
  'Increase Strength',
  'Improve Endurance',
  'General Fitness',
  'Athletic Performance',
];

const targetAreaOptions: { bodyPart: KelpBodyPart; title: string }[] = [
  { bodyPart: 'arms', title: 'Arms' },
  { bodyPart: 'back', title: 'Back' },
  { bodyPart: 'cardio', title: 'Cardio' },
  { bodyPart: 'chest', title: 'Chest' },
  { bodyPart: 'core', title: 'Core' },
  { bodyPart: 'full_body', title: 'Full Body' },
  { bodyPart: 'legs', title: 'Legs' },
  { bodyPart: 'shoulders', title: 'Shoulders' },
];

const dayOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

type TabOptions =
  | 'goals'
  | 'available_equipment'
  | 'target_areas'
  | 'physical_limitations';
const tabOptions: { id: TabOptions; label: string }[] = [
  { id: 'goals', label: 'Goals' },
  { id: 'available_equipment', label: 'Equipment' },
  { id: 'target_areas', label: 'Focus' },
  { id: 'physical_limitations', label: 'Limits' },
];

const StyledEditIcon = withUniwind(Edit);
export function EditProfileDialog({
  trigger,
}: {
  trigger?: React.ReactElement;
}) {
  const isLGAvailable = isLiquidGlassAvailable();
  const [visible, setVisible] = useState(false);
  const [activeTagCategory, setActiveTagCategory] =
    useState<TabOptions>('goals');

  const haptics = useHaptics();

  const { data: user, isLoading: isUserLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateProfile();

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
          <StyledEditIcon size={24} className='text-foreground' />
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

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    avatar_url: profile?.avatar_url || null,
    age: profile?.age || null,
    weight_kg: profile?.weight_kg || null,
    height_cm: profile?.height_cm || null,
    fitness_level: profile?.fitness_level || ('beginner' as KelpFitnessLevel),
    goals: profile?.goals || [],
    available_equipment: profile?.available_equipment || [],
    physical_limitations: profile?.physical_limitations || [],
    target_areas: profile?.target_areas || [],
    workout_days: profile?.workout_days || [],
    preferred_workout_time: profile?.preferred_workout_time || '',
    timezone: profile?.timezone || 'UTC',
  });

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateProfile({
        userId: user.id,
        updates: {
          name: formData.name,
          age: formData.age,
          weight_kg: formData.weight_kg,
          height_cm: formData.height_cm,
          fitness_level: formData.fitness_level,
          goals: formData.goals,
          available_equipment: formData.available_equipment,
          physical_limitations: formData.physical_limitations,
          target_areas: formData.target_areas,
          workout_days: formData.workout_days,
          preferred_workout_time: formData.preferred_workout_time || null,
          timezone: formData.timezone,
          avatar_url: formData.avatar_url,
        },
      });

      setVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setFormData({ ...formData, avatar_url: url || null });
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <Button
        size='icon'
        className='w-10 h-10 rounded-full bg-accent flex items-center justify-center'
        disabled
      >
        <Loader2 size={20} color='#000' className='animate-spin' />
      </Button>
    );
  }

  if (!user || !profile) {
    return (
      <Button
        size='icon'
        className='w-10 h-10 rounded-full bg-accent flex items-center justify-center'
        disabled
      >
        <UserIcon size={20} color='#000' />
      </Button>
    );
  }

  const hasChanges =
    JSON.stringify(formData) !==
    JSON.stringify({
      name: profile?.name || '',
      avatar_url: profile?.avatar_url || null,
      age: profile?.age || null,
      weight_kg: profile?.weight_kg || null,
      height_cm: profile?.height_cm || null,
      fitness_level: profile?.fitness_level || ('beginner' as KelpFitnessLevel),
      goals: profile?.goals || [],
      available_equipment: profile?.available_equipment || [],
      physical_limitations: profile?.physical_limitations || [],
      target_areas: profile?.target_areas || [],
      workout_days: profile?.workout_days || [],
      preferred_workout_time: profile?.preferred_workout_time || '',
      timezone: profile?.timezone || 'UTC',
    });

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
            <Button size='sm' variant='ghost' onPress={() => setVisible(false)}>
              <Text>Cancel</Text>
            </Button>
            <Text className='text-lg font-bold'>Edit Profile</Text>
            <Button
              size='sm'
              variant='ghost'
              onPress={handleSave}
              disabled={isSaving || !formData.name || !hasChanges}
            >
              {isSaving ? (
                <View className='flex flex-row items-center gap-2'>
                  <Loader2 size={16} color='#a3e635' className='animate-spin' />
                  <Text className='text-primary'>Saving...</Text>
                </View>
              ) : (
                <Text className='text-primary'>Save</Text>
              )}
            </Button>
          </View>

          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className='px-4 gap-6'>
              {/* Avatar Section */}
              {user && profile && (
                <View className='py-4'>
                  <AvatarUpload
                    userId={user.id}
                    currentAvatarUrl={formData.avatar_url}
                    onUploadComplete={handleAvatarUpload}
                  />
                </View>
              )}

              {/* Basic Info */}
              <View className='gap-4'>
                <View className='gap-2'>
                  <Text className='text-sm font-medium'>Full Name</Text>
                  <Input
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                    placeholder='Your name'
                  />
                </View>

                <View className='flex flex-row gap-4'>
                  <View className='flex-1 gap-2'>
                    <Text className='text-sm font-medium'>Age</Text>
                    <AgeSelectorSheet
                      value={formData.age || 25}
                      onChange={(age, close) => {
                        setFormData({ ...formData, age });
                        close();
                      }}
                    />
                  </View>
                  <View className='flex-1 gap-2'>
                    <Text className='text-sm font-medium'>Height</Text>
                    <HeightSelectorSheet
                      value={formData.height_cm!}
                      onChange={(height, close) => {
                        setFormData({ ...formData, height_cm: height });
                        close();
                      }}
                    />
                  </View>
                  <View className='flex-1 gap-2'>
                    <Text className='text-sm font-medium'>Weight</Text>
                    <WeightSelectorSheet
                      value={formData.weight_kg!}
                      onChange={(weight, close) => {
                        setFormData({ ...formData, weight_kg: weight });
                        close();
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Schedule */}
              <View>
                <Text className='text-white font-bold uppercase text-sm mb-4'>
                  Your Schedule
                </Text>

                <View className='bg-card rounded-lg p-4 border border-border gap-4'>
                  <View className='flex flex-row justify-between'>
                    {dayOptions.map((day) => (
                      <Pressable
                        key={day}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            workout_days: toggleArrayItem(
                              formData.workout_days,
                              day.toLowerCase()
                            ),
                          })
                        }
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center border',
                          formData.workout_days.includes(day.toLowerCase())
                            ? 'border-accent bg-accent'
                            : 'bg-muted border-border'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-xs font-bold',
                            formData.workout_days.includes(day.toLowerCase())
                              ? 'text-primary-foreground'
                              : 'text-foreground'
                          )}
                        >
                          {day[0]}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View className='pt-4 border-t border-border'>
                    <Input
                      value={formData.preferred_workout_time || ''}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          preferred_workout_time: text,
                        })
                      }
                      placeholder='Preferred time (e.g., 06:00)'
                      className='border-transparent'
                    />
                  </View>
                </View>
              </View>

              {/* Fitness Level */}
              <View>
                <Text className='text-xl font-semibold mb-4 uppercase italic'>
                  Fitness Level
                </Text>
                <View className='gap-3'>
                  {fitnessLevels.map((level) => (
                    <Pressable
                      key={level.value}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          fitness_level: level.value,
                        })
                      }
                      className={cn(
                        'p-4 rounded-lg border-2',
                        formData.fitness_level === level.value
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-semibold uppercase italic',
                          formData.fitness_level === level.value &&
                            'text-primary-foreground'
                        )}
                      >
                        {level.label}
                      </Text>
                      <Text
                        className={cn(
                          'text-xs italic',
                          formData.fitness_level === level.value
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                        )}
                      >
                        {level.desc}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Details & Tags */}
              <View>
                <Text className='text-white font-bold uppercase text-sm mb-4'>
                  Details
                </Text>

                {/* Category Switcher */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className='mb-2'
                  contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
                >
                  {tabOptions.map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => setActiveTagCategory(cat.id)}
                      className={cn(
                        'px-4 py-2 rounded-full border',
                        activeTagCategory === cat.id
                          ? 'bg-secondary border-white'
                          : 'bg-card border-border'
                      )}
                    >
                      <Text
                        className={cn(
                          'font-bold text-xs',
                          activeTagCategory === cat.id
                            ? 'text-secondary-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <View className='bg-card rounded-lg p-4 border border-border'>
                  {/* Goals */}
                  {activeTagCategory === 'goals' && (
                    <View className='flex flex-row flex-wrap gap-2'>
                      {goalOptions.map((goal) => (
                        <Pressable
                          key={goal}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              goals: toggleArrayItem(formData.goals, goal),
                            })
                          }
                          className={cn(
                            'px-3 py-1.5 rounded-lg border flex flex-row items-center gap-2',
                            formData.goals.includes(goal)
                              ? 'bg-lime-900/30 border-lime-500/30'
                              : 'border-border bg-muted'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-xs font-bold uppercase tracking-wide',
                              formData.goals.includes(goal)
                                ? 'text-lime-400'
                                : 'text-muted-foreground'
                            )}
                          >
                            {goal}
                          </Text>
                          {formData.goals.includes(goal) && (
                            <X size={16} color='#a3e635' />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}

                  {/* Available Equipment */}
                  {activeTagCategory === 'available_equipment' && (
                    <View>
                      <View className='flex flex-row gap-2 mb-4 justify-between items-center'>
                        <Text className='text-sm text-muted-foreground'>
                          Add to your available equipment:
                        </Text>
                        <GymEquipmentSelectorSheet
                          trigger={
                            <Button
                              variant='accent'
                              size='icon'
                              className='rounded-md'
                            >
                              <Plus size={16} color='#000' />
                            </Button>
                          }
                          value={formData.available_equipment}
                          onChange={(equipment: string[]) =>
                            setFormData({
                              ...formData,
                              available_equipment: equipment,
                            })
                          }
                        />
                      </View>
                      <View className='flex flex-row flex-wrap gap-2'>
                        {formData.available_equipment.length === 0 && (
                          <Text className='text-sm text-muted-foreground'>
                            No equipment added. Use the "+" button to add.
                          </Text>
                        )}
                        {formData.available_equipment.map((equipment) => (
                          <Tag
                            key={equipment}
                            text={equipment}
                            type='accent'
                            onRemove={() =>
                              setFormData({
                                ...formData,
                                available_equipment:
                                  formData.available_equipment.filter(
                                    (e) => e !== equipment
                                  ),
                              })
                            }
                          />
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Target Areas */}
                  {activeTagCategory === 'target_areas' && (
                    <View className='flex flex-row flex-wrap gap-2'>
                      {targetAreaOptions.map((area) => (
                        <Pressable
                          key={area.bodyPart}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              target_areas: toggleArrayItem(
                                formData.target_areas,
                                area.bodyPart
                              ),
                            })
                          }
                          className={cn(
                            'px-3 py-1.5 rounded-lg border flex flex-row items-center gap-2',
                            formData.target_areas.includes(area.bodyPart)
                              ? 'bg-lime-900/30 border-lime-500/30'
                              : 'border-border bg-muted'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-xs font-bold uppercase tracking-wide',
                              formData.target_areas.includes(area.bodyPart)
                                ? 'text-lime-400'
                                : 'text-muted-foreground'
                            )}
                          >
                            {area.title}
                          </Text>
                          {formData.target_areas.includes(area.bodyPart) && (
                            <X size={16} color='#a3e635' />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}

                  {/* Physical Limitations */}
                  {activeTagCategory === 'physical_limitations' && (
                    <View className='flex flex-row flex-wrap gap-2'>
                      {PHYSICAL_LIMITATIONS.map((limitation) => (
                        <Pressable
                          key={limitation}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              physical_limitations: toggleArrayItem(
                                formData.physical_limitations || [],
                                limitation
                              ),
                            })
                          }
                          className={cn(
                            'px-3 py-1.5 rounded-lg border flex flex-row items-center gap-2',
                            formData.physical_limitations?.includes(limitation)
                              ? 'bg-destructive/30 border-destructive/30'
                              : 'border-border bg-muted'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-xs font-bold uppercase tracking-wide',
                              formData.physical_limitations?.includes(
                                limitation
                              )
                                ? 'text-destructive-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {limitation}
                          </Text>
                          {formData.physical_limitations?.includes(
                            limitation
                          ) && <X size={16} color='#ef4444' />}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
function Tag({
  text,
  type = 'neutral',
  onRemove,
}: {
  text: string;
  type?: 'neutral' | 'accent' | 'danger';
  onRemove: () => void;
}) {
  const styles = {
    neutral: 'bg-card border border-border text-foreground',
    accent: 'bg-lime-900/30 border border-lime-500/30 text-lime-400',
    danger: 'bg-destructive/30 border border-destructive/30 text-destructive',
  };
  return (
    <View
      className={`px-3 py-1.5 rounded-lg flex flex-row items-center gap-2 ${styles[type]}`}
    >
      <Text className='text-xs font-bold uppercase tracking-wide'>{text}</Text>
      <Pressable onPress={onRemove}>
        <X size={12} color={type === 'accent' ? '#a3e635' : '#ef4444'} />
      </Pressable>
    </View>
  );
}
