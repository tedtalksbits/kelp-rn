'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ExerciseLogInsert,
  ExerciseLogUpdate,
} from '@/libs/supabase/types/database.types';
import { supabase } from '@/libs/supabase/supabase';

export function useExerciseLogs(sessionId?: string) {
  return useQuery({
    queryKey: ['exercise-logs', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required');

      const { data, error } = await supabase
        .from('kelp_exercise_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });
}

export function useCreateExerciseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: ExerciseLogInsert) => {
      const { data, error } = await supabase
        .from('kelp_exercise_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['exercise-logs', data.session_id],
      });
    },
  });
}

export function useUpdateExerciseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ExerciseLogUpdate;
    }) => {
      const { data, error } = await supabase
        .from('kelp_exercise_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['exercise-logs', data.session_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['workout-session', data.session_id],
      });
    },
  });
}

export function useDeleteExerciseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('kelp_exercise_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      return logId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['workout-session'] });
    },
  });
}

export function useReorderExerciseLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; order_index: number }[]) => {
      const promises = updates.map(({ id, order_index }) =>
        supabase.from('kelp_exercise_logs').update({ order_index }).eq('id', id)
      );

      const results = await Promise.all(promises);

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }

      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['workout-session'] });
    },
  });
}

export function useBatchUpdateExerciseLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: { id: string; updates: ExerciseLogUpdate }[]
    ) => {
      const promises = updates.map(({ id, updates: logUpdates }) =>
        supabase
          .from('kelp_exercise_logs')
          .update(logUpdates)
          .eq('id', id)
          .select()
          .single()
      );

      const results = await Promise.all(promises);

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }

      return results.map((r) => r.data).filter(Boolean);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['workout-session'] });
    },
  });
}
