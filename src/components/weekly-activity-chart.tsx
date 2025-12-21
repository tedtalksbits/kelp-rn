import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/text';
import { WeeklyActivityDay } from '@/features/workouts/hooks/use-weekly-activity';

interface WeeklyActivityChartProps {
  data: WeeklyActivityDay[];
  isLoading?: boolean;
}

export function WeeklyActivityChart({
  data,
  isLoading,
}: WeeklyActivityChartProps) {
  if (isLoading) {
    return (
      <View className='bg-card rounded-lg p-4'>
        <Text className='text-lg font-semibold text-foreground mb-4'>
          Weekly Activity
        </Text>
        <View className='flex-row justify-between items-end h-32'>
          {Array.from({ length: 7 }).map((_, i) => (
            <View key={i} className='flex-1 items-center'>
              <View className='w-8 h-16 bg-muted rounded-t-lg animate-pulse' />
              <Text className='text-xs text-muted-foreground mt-2'>-</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className='bg-card rounded-lg p-4'>
        <Text className='text-lg font-semibold text-foreground mb-4'>
          Weekly Activity
        </Text>
        <Text className='text-center text-muted-foreground py-8'>
          No activity data available for this week
        </Text>
      </View>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.exercise_count), 1);

  return (
    <View className='bg-card rounded-lg p-4'>
      <Text className='text-lg font-semibold text-foreground mb-4'>
        Weekly Activity
      </Text>
      <View className='flex-row justify-between items-end h-32 mb-2'>
        {data.map((day) => {
          const heightPercentage =
            maxCount > 0 ? (day.exercise_count / maxCount) * 100 : 0;
          const hasActivity = day.exercise_count > 0;

          return (
            <View key={day.day_of_week} className='flex-1 items-center px-1'>
              <View className='w-full items-center mb-1'>
                {hasActivity && (
                  <Text className='text-xs font-medium text-accent'>
                    {day.exercise_count}
                  </Text>
                )}
              </View>
              <View
                className={`w-full rounded-t-lg ${
                  hasActivity ? 'bg-accent' : 'bg-muted'
                }`}
                style={{
                  height: hasActivity
                    ? `${Math.max(heightPercentage, 10)}%`
                    : 8,
                }}
              />
              <Text
                className={`text-xs mt-2 font-medium ${
                  hasActivity ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {day.day_name}
              </Text>
            </View>
          );
        })}
      </View>
      <Text className='text-xs text-muted-foreground text-center mt-2'>
        Total exercises completed this week
      </Text>
    </View>
  );
}
