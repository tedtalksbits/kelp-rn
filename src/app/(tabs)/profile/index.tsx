import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { useProfile } from '@/features/user-profile/hooks/use-profile';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  Activity,
  AlertCircle,
  Calendar,
  Dumbbell,
  Flame,
  Target,
  Trophy,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { EditProfileDialog } from '@/features/user-profile/components/edit-profile-dialog';
import { Surface } from '@/components/surface';
import ScreenScrollView from '@/components/layouts/screen-scroll-view';
import ScreenView from '@/components/screen-view';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ProfileScreen() {
  const [heightCm, setHeightCm] = React.useState<number>(170);
  const { data: userProfile, isLoading } = useProfile();
  const { signOut } = useAuth();
  const level = userProfile
    ? getKelpLevel(userProfile.total_workouts_completed || 0)
    : null;

  if (isLoading) {
    return (
      <ScreenScrollView>
        <Text className='text-muted-foreground'>Loading...</Text>
      </ScreenScrollView>
    );
  }

  if (!userProfile) {
    return (
      <ScreenScrollView>
        <Text className='text-muted-foreground'>No profile found.</Text>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenView>
      <ScreenScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className='flex flex-row items-center justify-between mb-6'>
          <Text className='text-3xl font-black uppercase'>Profile</Text>
          <EditProfileDialog />
        </View>

        {/* Header / Avatar */}
        <View className='flex flex-col items-center justify-center gap-4 mb-8'>
          <View className='w-20 h-20 rounded-full bg-card flex items-center justify-center border-2 border-border'>
            {userProfile.avatar_url ? (
              <Image
                source={{ uri: userProfile.avatar_url }}
                className='w-full h-full rounded-full'
                resizeMode='cover'
              />
            ) : (
              <Text className='text-2xl font-bold text-muted-foreground'>
                {userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            )}
          </View>
          <Text className='text-xl font-bold'>{userProfile.name}</Text>
          <View className='flex flex-row items-center gap-4 w-full max-w-62.5 justify-between'>
            <View className='gap-2 items-center'>
              <View className='bg-accent/20 p-3 rounded-full border-2 border-accent'>
                <Trophy size={24} color='#a3e635' />
              </View>
              {level && (
                <Text className='text-accent text-[10px] font-medium uppercase tracking-wide'>
                  Lvl {level.level} - {level.name}
                </Text>
              )}
            </View>
            <View className='w-px min-h-8 bg-border'></View>
            <View className='flex items-center gap-2'>
              <Text className='text-muted-foreground text-sm capitalize'>
                {userProfile.fitness_level}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View className='flex flex-row gap-4 mb-6'>
          <Surface className='flex-1 relative overflow-hidden'>
            <View className='absolute top-0 right-0 p-4 opacity-10'>
              <Flame size={48} color='#f97316' />
            </View>
            <Text className='text-3xl font-black mb-2'>
              {userProfile.current_streak}
            </Text>
            <Text className='text-xs text-muted-foreground uppercase tracking-wide font-bold'>
              Current Streak
            </Text>
          </Surface>
          <Surface className='flex-1 relative overflow-hidden'>
            <View className='absolute top-0 right-0 p-4 opacity-10'>
              <Trophy size={48} color='#ffffff' />
            </View>
            <Text className='text-3xl font-black mb-2'>
              {userProfile.total_workouts_completed}
            </Text>
            <Text className='text-xs text-muted-foreground uppercase tracking-wide font-bold'>
              Workouts Done
            </Text>
          </Surface>
        </View>

        {/* Physical Stats Row */}
        <Surface className='p-5 mb-6 flex flex-row justify-between items-center'>
          <View className='items-center'>
            <Text className='text-xs text-muted-foreground uppercase font-bold mb-1'>
              Age
            </Text>
            <Text className='text-xl font-black'>{userProfile.age}</Text>
          </View>
          <View className='w-px h-8 bg-border'></View>
          <View className='items-center'>
            <Text className='text-xs text-muted-foreground uppercase font-bold mb-1'>
              Height
            </Text>
            <Text className='text-xl font-black'>
              {userProfile.height_cm}{' '}
              <Text className='text-xs font-medium text-muted-foreground'>
                cm
              </Text>
            </Text>
          </View>
          <View className='w-px h-8 bg-border'></View>
          <View className='items-center'>
            <Text className='text-xs text-muted-foreground uppercase font-bold mb-1'>
              Weight
            </Text>
            <Text className='text-xl font-black'>
              {userProfile.weight_kg}{' '}
              <Text className='text-xs font-medium text-muted-foreground'>
                kg
              </Text>
            </Text>
          </View>
        </Surface>

        {/* Schedule Section */}
        <Surface className='rounded-2xl p-6 mb-6'>
          <View className='flex flex-row justify-between items-center mb-4'>
            <View className='flex flex-row items-center gap-2'>
              <Calendar size={16} color='#a3e635' />
              <Text className='font-bold uppercase text-sm'>Schedule</Text>
            </View>
            {userProfile.preferred_workout_time && (
              <Text className='text-muted-foreground text-xs'>
                {userProfile.preferred_workout_time.slice(0, 5)}
              </Text>
            )}
          </View>

          <View className='flex flex-row justify-between'>
            {days.map((day, i) => {
              const isActive = userProfile.workout_days.includes(day);
              return (
                <View key={day} className='flex flex-col items-center gap-2'>
                  <View
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? 'text-black' : 'text-muted-foreground'
                      }`}
                    >
                      {dayLabels[i]}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Surface>

        {/* Details Lists */}
        <View className='gap-6'>
          <View>
            <View className='flex flex-row items-center gap-2 mb-3'>
              <Target size={16} color='#ef4444' />
              <Text className='font-bold uppercase text-sm'>Goals</Text>
            </View>
            <View className='flex flex-row flex-wrap gap-2'>
              {userProfile.goals.map((g) => (
                <Tag key={g} text={g} />
              ))}
            </View>
          </View>

          {userProfile.available_equipment &&
            userProfile.available_equipment.length > 0 && (
              <View>
                <View className='flex flex-row items-center gap-2 mb-3'>
                  <Dumbbell size={16} color='#3b82f6' />
                  <Text className='font-bold uppercase text-sm'>Equipment</Text>
                </View>
                <View className='flex flex-row flex-wrap gap-2'>
                  {userProfile.available_equipment.map((e) => (
                    <Tag key={e} text={e} />
                  ))}
                </View>
              </View>
            )}

          {/* Focus Areas */}
          <View>
            <View className='flex flex-row items-center gap-2 mb-3'>
              <Activity size={16} color='#a855f7' />
              <Text className='font-bold uppercase text-sm'>Focus Areas</Text>
            </View>
            <View className='flex flex-row flex-wrap gap-2'>
              {userProfile.target_areas.map((a) => (
                <Tag key={a} text={a.replace('_', ' ')} />
              ))}
            </View>
          </View>

          {/* Limitations Warning */}
          {userProfile.physical_limitations &&
            userProfile.physical_limitations.length > 0 && (
              <Surface className='bg-destructive/10  p-4 flex flex-row gap-3'>
                <AlertCircle color='#ef4444' size={20} />
                <View className='flex-1'>
                  <Text className='text-destructive text-sm font-bold uppercase mb-1'>
                    Physical Limitations
                  </Text>
                  <View className='flex flex-row flex-wrap gap-2'>
                    {userProfile.physical_limitations.map((l) => (
                      <Tag key={l} text={l} type='danger' />
                    ))}
                  </View>
                </View>
              </Surface>
            )}
        </View>

        {/* Log Out */}
        <View className='mt-12 items-center'>
          <Button
            variant='secondary'
            onPress={async () => {
              await signOut();
              router.replace('/(auth)/sign-in');
            }}
          >
            Log Out
          </Button>
        </View>
      </ScreenScrollView>
    </ScreenView>
  );
}

const Tag = ({
  text,
  type = 'neutral',
}: {
  text: string;
  type?: 'neutral' | 'accent' | 'danger';
}) => {
  const styles = {
    neutral: 'bg-card text-foreground',
    accent: 'bg-accent/20 text-accent',
    danger: 'bg-destructive/30 text-destructive',
  };

  return (
    <View className={`px-3 py-1.5 rounded-lg ${styles[type]}`}>
      <Text className='text-xs font-bold uppercase tracking-wide'>{text}</Text>
    </View>
  );
};

export interface KelpLevel {
  level: number;
  name: string;
  minWorkouts: number;
  maxWorkouts: number | null;
}

export const KELP_LEVELS: KelpLevel[] = [
  { level: 1, name: 'Rookie', minWorkouts: 0, maxWorkouts: 5 },
  { level: 2, name: 'Starter', minWorkouts: 6, maxWorkouts: 15 },
  { level: 3, name: 'Grinder', minWorkouts: 16, maxWorkouts: 30 },
  { level: 4, name: 'Mover', minWorkouts: 31, maxWorkouts: 50 },
  { level: 5, name: 'Athlete', minWorkouts: 51, maxWorkouts: 75 },
  { level: 6, name: 'Competitor', minWorkouts: 76, maxWorkouts: 110 },
  { level: 7, name: 'Pro', minWorkouts: 111, maxWorkouts: 160 },
  { level: 8, name: 'Elite', minWorkouts: 161, maxWorkouts: 225 },
  { level: 9, name: 'Master', minWorkouts: 226, maxWorkouts: 300 },
  { level: 10, name: 'Champion', minWorkouts: 301, maxWorkouts: 400 },
  { level: 11, name: 'Titan', minWorkouts: 401, maxWorkouts: 550 },
  { level: 12, name: 'Legend', minWorkouts: 551, maxWorkouts: 750 },
  { level: 13, name: 'Mythic', minWorkouts: 751, maxWorkouts: 999 },
  { level: 14, name: 'Divine', minWorkouts: 1000, maxWorkouts: 1500 },
  { level: 15, name: 'Immortal', minWorkouts: 1501, maxWorkouts: null },
];

export function getKelpLevel(workoutsCompleted: number): KelpLevel {
  const workouts = Math.max(0, workoutsCompleted);

  if (workouts === 0) {
    return {
      level: 0,
      name: 'Not Started',
      minWorkouts: 0,
      maxWorkouts: 0,
    };
  }

  const level =
    KELP_LEVELS.find(
      ({ minWorkouts, maxWorkouts }) =>
        workouts >= minWorkouts &&
        (maxWorkouts === null || workouts <= maxWorkouts)
    ) ?? KELP_LEVELS[KELP_LEVELS.length - 1];

  return level;
}
