'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ExerciseInsert,
  ExerciseUpdate,
} from '@/libs/supabase/types/database.types';
import { supabase } from '@/libs/supabase/supabase';

export function useExercises(userId?: string) {
  return useQuery({
    queryKey: ['exercises', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kelp_exercises')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useExercise(exerciseId?: string) {
  return useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: async () => {
      if (!exerciseId) throw new Error('Exercise ID is required');

      const { data, error } = await supabase
        .from('kelp_exercises')
        .select('*')
        .eq('id', exerciseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId,
  });
}

export function useCreateCustomExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: ExerciseInsert) => {
      const { data, error } = await supabase
        .from('kelp_exercises')
        .insert(exercise)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['exercises', data.created_by],
      });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ExerciseUpdate;
    }) => {
      const { data, error } = await supabase
        .from('kelp_exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['exercises', data.created_by],
      });
      queryClient.invalidateQueries({ queryKey: ['exercise', data.id] });
    },
  });
}
