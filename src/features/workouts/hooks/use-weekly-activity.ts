import { supabase } from '@/libs/supabase/supabase';
import { useQuery } from '@tanstack/react-query';

export interface WeeklyActivityDay {
  day_of_week: number; // 0-6 (0=Monday, 6=Sunday)
  day_name: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  exercise_count: number;
  workout_date: string;
  percentage?: number; // Calculated client-side for visualization
}

/**
 * Hook to fetch weekly activity data (exercise counts by day of week)
 * @param userId - The user ID to fetch activity for
 * @param weekStart - Optional week start date (defaults to current week's Monday)
 */
export function useWeeklyActivity(userId?: string, weekStart?: string) {
  return useQuery({
    queryKey: ['weekly-activity', userId, weekStart],
    queryFn: async (): Promise<WeeklyActivityDay[]> => {
      if (!userId) throw new Error('User ID is required');

      const params: { p_user_id: string; p_week_start?: string } = {
        p_user_id: userId,
      };

      if (weekStart) {
        params.p_week_start = weekStart;
      }

      const { data, error } = await supabase.rpc(
        'kelp_get_weekly_activity',
        params
      );

      if (error) throw error;

      // Type assertion for the RPC response
      // Note: Types will be correct after running migration 38
      const typedData = (data || []) as unknown as WeeklyActivityDay[];

      // Calculate percentage for visualization
      const maxCount = Math.max(...typedData.map((d) => d.exercise_count), 1);

      return typedData.map((day) => ({
        ...day,
        percentage: maxCount > 0 ? (day.exercise_count / maxCount) * 100 : 0,
      }));
    },
    enabled: !!userId,
  });
}
