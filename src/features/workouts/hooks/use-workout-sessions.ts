'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Exercise,
  ExerciseLog,
  WorkoutSession,
  WorkoutSessionInsert,
  WorkoutSessionUpdate,
} from '@/libs/supabase/types/database.types';
import { supabase } from '@/libs/supabase/supabase';

// ============================================
// WORKOUT SESSIONS (formerly Workouts)
// ============================================

export type WorkoutSessionWithLogs = WorkoutSession & {
  exercise_logs: (ExerciseLog & { exercise: Exercise })[];
};
export function useWorkoutSessions(userId?: string) {
  return useQuery({
    queryKey: ['workout-sessions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .select(
          `
          *,
          exercise_logs:kelp_exercise_logs(
            *,
            exercise:kelp_exercises(*)
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useTodayScheduledWorkoutSessions() {
  return useQuery({
    queryKey: ['today-workout-sessions'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .select(
          `
          *,
          exercise_logs:kelp_exercise_logs(
            *,
            exercise:kelp_exercises(*)
          )
        `
        )
        .eq('user_id', user.id)
        .gte('scheduled_for', today.toISOString())
        .lt(
          'scheduled_for',
          new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTodayWorkoutSessions() {
  return useQuery({
    queryKey: ['today-unfinished-workout-sessions'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .select(
          `
          *,
          exercise_logs:kelp_exercise_logs(
            *,
            exercise:kelp_exercises(*)
          )
        `
        )
        .eq('user_id', user.id)
        //  sessions created today that are not completed
        .gte('created_at', today.toISOString())
        .lt(
          'created_at',
          new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        )
        // completed_at is null
        .is('completed_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useWorkoutSession(sessionId?: string) {
  return useQuery({
    queryKey: ['workout-session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required');

      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .select(
          `
          *,
          exercise_logs:kelp_exercise_logs(
            *,
            exercise:kelp_exercises(*)
          ),
          template:kelp_user_workout_templates(*)
          
        `
        )
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!sessionId,
  });
}

export function useCreateWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: WorkoutSessionInsert) => {
      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data as WorkoutSession;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workout-sessions', data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ['user-stats', data.user_id] });
    },
  });
}

export function useUpdateWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: WorkoutSessionUpdate;
    }) => {
      const { data, error } = await supabase
        .from('kelp_workout_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as WorkoutSession;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workout-sessions', data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ['workout-session', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', data.user_id] });
    },
  });
}

export function useCompleteWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      durationMinutes,
      perceivedDifficulty,
      userNotes,
      aiAnalysis,
      audioUrl,
    }: {
      sessionId: string;
      durationMinutes: number;
      perceivedDifficulty?: number;
      userNotes?: string;
      aiAnalysis?: string;
      audioUrl?: string;
    }) => {
      const { error } = await supabase.rpc('kelp_complete_workout', {
        p_workout_id: sessionId,
        p_duration_minutes: durationMinutes,
        p_perceived_difficulty: perceivedDifficulty,
        p_user_notes: userNotes,
        p_ai_analysis: aiAnalysis,
        p_audio_url: audioUrl,
      });

      if (error) throw error;

      // Fetch the updated session
      const { data: session, error: fetchError } = await supabase
        .from('kelp_workout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;
      return session as WorkoutSession;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workout-sessions', data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ['workout-session', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', data.user_id] });
    },
  });
}

// ============================================
// USER STATS
// ============================================

export function useUserStats(userId?: string) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('kelp_get_user_stats', {
        p_user_id: userId,
      });

      if (error) throw error;
      return (
        data?.[0] || {
          current_streak: 0,
          longest_streak: 0,
          total_workouts: 0,
          workouts_this_week: 0,
          workouts_this_month: 0,
          next_scheduled_date: null,
        }
      );
    },
    enabled: !!userId,
  });
}

// ============================================
// EXERCISE LOG COMPLETION (for backward compatibility)
// ============================================

export function useToggleExerciseComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const { data, error } = await supabase
        .from('kelp_exercise_logs')
        .update({ completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workout-session', data.session_id],
      });
    },
  });
}

export const getWorkoutSessionEquipments = (
  workoutSession: WorkoutSessionWithLogs
) => {
  const equipmentSet = new Set<string>();
  workoutSession.exercise_logs.forEach((log) => {
    log.exercise?.equipment_required?.forEach((eq) => equipmentSet.add(eq));
  });
  return Array.from(equipmentSet);
};

// ============================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================
// These allow existing components to continue working during the migration

/** @deprecated Use useWorkoutSessions instead */
export const useWorkouts = useWorkoutSessions;

/** @deprecated Use useWorkoutSession instead */
export const useWorkout = useWorkoutSession;

/** @deprecated Use useCreateWorkoutSession instead */
export const useCreateWorkout = useCreateWorkoutSession;

/** @deprecated Use useUpdateWorkoutSession instead */
export const useUpdateWorkout = useUpdateWorkoutSession;

/** @deprecated Use useCompleteWorkoutSession instead */
export const useCompleteWorkout = useCompleteWorkoutSession;
