import { ScrollView, View } from 'react-native';
import React from 'react';
import { Text } from '@/components/text';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'react-native';
import Logo from '../../../assets/hero.png';
import { useProfile } from '@/features/user-profile/hooks/use-profile';
import { useTodayWorkoutSessions } from '@/features/workouts/hooks/use-workout-sessions';
import { useWeeklyActivity } from '@/features/workouts/hooks/use-weekly-activity';
import { Link } from 'expo-router';
import { Button } from '@/components/button';
import { WeeklyActivityChart } from '@/components/weekly-activity-chart';

export default function index() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: sessions } = useTodayWorkoutSessions();
  const { data: weeklyActivity, isLoading: isLoadingActivity } =
    useWeeklyActivity(profile?.user_id);

  const lastSession = sessions && sessions.length > 0 ? sessions[0] : null;
  return (
    <View className='flex-1 bg-background relative'>
      <ParallaxScrollView
        h={0.3}
        headerImage={<Image source={Logo} style={{ flex: 1 }} />}
      >
        <View>
          <Text
            className={`text-xs font-black tracking-widest uppercase text-accent mb-2 block`}
          >
            {lastSession ? <>Continue Workout</> : 'Workout of the Day'}
          </Text>
          <Text className='text-4xl font-black uppercase leading-[0.9] mb-4'>
            {lastSession ? (
              <>{lastSession.title}</>
            ) : (
              <>Ignite Your Potential</>
            )}
          </Text>
          <Text className='text-muted-foreground mb-6 max-w-[80%] line-clamp-2'>
            {lastSession
              ? lastSession.description
              : 'Push past your limits with this high-intensity interval series.'}
          </Text>
          {lastSession && <Text>Started {lastSession.started_at}</Text>}
          {lastSession ? (
            <Link href={`/workout/${lastSession.id}`}>
              <Button variant='accent' className='w-full sm:w-auto'>
                Continue Workout
              </Button>
            </Link>
          ) : (
            <Button variant='secondary' className='w-full sm:w-auto'>
              Start Workout
            </Button>
          )}
        </View>

        <View className='mt-8'>
          <WeeklyActivityChart
            data={weeklyActivity || []}
            isLoading={isLoadingActivity}
          />
        </View>
      </ParallaxScrollView>
    </View>
  );
}
