import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/text';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'react-native';
import Logo from '../../../assets/hero.png';
import { useProfile } from '@/features/user-profile/hooks/use-profile';
import { useTodayWorkoutSessions } from '@/features/workouts/hooks/use-workout-sessions';
import { useWeeklyActivity } from '@/features/workouts/hooks/use-weekly-activity';

export default function index() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: sessions } = useTodayWorkoutSessions();
  const { data: weeklyActivity } = useWeeklyActivity(profile?.user_id);

  const lastSession = sessions && sessions.length > 0 ? sessions[0] : null;
  return (
    <ParallaxScrollView
      h={0.3}
      headerImage={<Image source={Logo} style={{ flex: 1 }} />}
    >
      <Text
        className={`text-xs font-black tracking-widest uppercase text-accent mb-2 block`}
      >
        {lastSession ? <>Continue Workout</> : 'Workout of the Day'}
      </Text>
    </ParallaxScrollView>
  );
}
