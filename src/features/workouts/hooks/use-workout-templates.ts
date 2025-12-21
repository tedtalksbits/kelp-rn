'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SystemWorkoutTemplate,
  UserWorkoutTemplate,
  UserWorkoutTemplateInsert,
  UserWorkoutTemplateUpdate,
  UserTemplateExercise,
  UserTemplateExerciseInsert,
  KelpBodyPart,
  KelpFitnessLevel,
  SystemTemplateExercise,
} from '@/libs/supabase/types/database.types';
import { supabase } from '@/libs/supabase/supabase';

// ============================================
// SYSTEM TEMPLATES (Read-Only)
// ============================================

export function useSystemTemplates(filters?: {
  focusArea?: KelpBodyPart;
  difficultyLevel?: KelpFitnessLevel;
}) {
  return useQuery({
    queryKey: ['system-templates', filters],
    queryFn: async () => {
      let query = supabase
        .from('kelp_system_workout_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.focusArea) {
        query = query.eq('focus_area', filters.focusArea);
      }

      if (filters?.difficultyLevel) {
        query = query.eq('difficulty_level', filters.difficultyLevel);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}

export function useSystemTemplate(templateId?: string) {
  return useQuery({
    queryKey: ['system-template', templateId],
    queryFn: async () => {
      if (!templateId) throw new Error('Template ID is required');

      const { data, error } = await supabase
        .from('kelp_system_workout_templates')
        .select(
          `
          *,
          exercises:kelp_system_template_exercises(
            *,
            exercise:kelp_exercises(*)
          )
        `
        )
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!templateId,
  });
}

// ============================================
// USER TEMPLATES (Full CRUD)
// ============================================

export function useUserTemplates(filters?: {
  isFavorite?: boolean;
  focusArea?: KelpBodyPart;
  isAiGenerated?: boolean;
}) {
  return useQuery({
    queryKey: ['user-templates', filters],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) throw new Error('User ID is required');

      let query = supabase
        .from('kelp_user_workout_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.isFavorite !== undefined) {
        query = query.eq('is_favorite', filters.isFavorite);
      }

      if (filters?.focusArea) {
        query = query.eq('focus_area', filters.focusArea);
      }

      if (filters?.isAiGenerated !== undefined) {
        query = query.eq('is_ai_generated', filters.isAiGenerated);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}

export function useUserTemplate(templateId?: string) {
  return useQuery({
    queryKey: ['user-template', templateId],
    queryFn: async () => {
      if (!templateId) throw new Error('Template ID is required');

      const { data, error } = await supabase
        .from('kelp_user_workout_templates')
        .select(
          `
          *,
          exercises:kelp_user_template_exercises(
            *,
            exercise:kelp_exercises(*)
          )
        `
        )
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!templateId,
  });
}

export function useCreateUserTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: UserWorkoutTemplateInsert) => {
      const { data, error } = await supabase
        .from('kelp_user_workout_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', data.user_id],
      });
    },
  });
}

export function useUpdateUserTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UserWorkoutTemplateUpdate;
    }) => {
      const { data, error } = await supabase
        .from('kelp_user_workout_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ['user-template', data.id] });
    },
  });
}

export function useDeleteUserTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('kelp_user_workout_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { id, userId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', data.userId],
      });
      queryClient.invalidateQueries({ queryKey: ['user-template', data.id] });
    },
  });
}

export function useToggleFavoriteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isFavorite,
    }: {
      id: string;
      isFavorite: boolean;
    }) => {
      const { data, error } = await supabase
        .from('kelp_user_workout_templates')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as UserWorkoutTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', data.user_id],
      });
      queryClient.invalidateQueries({ queryKey: ['user-template', data.id] });
    },
  });
}

// ============================================
// TEMPLATE EXERCISES (CRUD)
// ============================================

export function useCreateTemplateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exercise: UserTemplateExerciseInsert) => {
      const { data, error } = await supabase
        .from('kelp_user_template_exercises')
        .insert(exercise)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-template', data.template_id],
      });
    },
  });
}

export function useUpdateTemplateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<UserTemplateExercise>;
    }) => {
      const { data, error } = await supabase
        .from('kelp_user_template_exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-template', data.template_id],
      });
    },
  });
}

export function useDeleteTemplateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      templateId,
    }: {
      id: string;
      templateId: string;
    }) => {
      const { error } = await supabase
        .from('kelp_user_template_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id, templateId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['user-template', data.templateId],
      });
    },
  });
}

// ============================================
// TEMPLATE OPERATIONS (Clone, Duplicate, Stats)
// ============================================

export function useCloneSystemTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      systemTemplateId,
      userId,
      customTitle,
    }: {
      systemTemplateId: string;
      userId: string;
      customTitle?: string;
    }) => {
      const { data, error } = await supabase.rpc(
        'kelp_clone_system_template_to_user',
        {
          p_system_template_id: systemTemplateId,
          p_user_id: userId,
          p_custom_title: customTitle,
        }
      );

      if (error) throw error;
      return data as string; // Returns new user template ID
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', variables.userId],
      });
    },
  });
}

export function useDuplicateUserTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      userId,
      newTitle,
    }: {
      templateId: string;
      userId: string;
      newTitle?: string;
    }) => {
      const { data, error } = await supabase.rpc(
        'kelp_duplicate_user_template',
        {
          p_user_template_id: templateId,
          p_user_id: userId,
          p_new_title: newTitle,
        }
      );

      if (error) throw error;
      return data; // Returns new template ID
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-templates', variables.userId],
      });
    },
  });
}

export function useTemplateStats(templateId?: string, userId?: string) {
  return useQuery({
    queryKey: ['template-stats', templateId, userId],
    queryFn: async () => {
      if (!templateId || !userId)
        throw new Error('Template ID and User ID are required');

      const { data, error } = await supabase.rpc(
        'kelp_get_user_template_stats',
        {
          p_user_template_id: templateId,
          p_user_id: userId,
        }
      );

      if (error) throw error;
      return data as {
        times_used: number;
        last_used_at: string | null;
        avg_difficulty: number | null;
        avg_duration_minutes: number | null;
        total_sessions_completed: number;
      }[];
    },
    enabled: !!templateId && !!userId,
  });
}

// ============================================
// START SESSION FROM TEMPLATE
// ============================================

export function useStartSessionFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userTemplateId,
      userId,
      scheduledFor,
    }: {
      userTemplateId: string;
      userId: string;
      scheduledFor?: string;
    }) => {
      const { data, error } = await supabase.rpc(
        'kelp_create_session_from_user_template',
        {
          p_user_template_id: userTemplateId,
          p_user_id: userId,
          p_scheduled_for: scheduledFor,
        }
      );

      if (error) throw error;
      return data as string; // Returns new session ID
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workout-sessions', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-stats', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'template-stats',
          variables.userTemplateId,
          variables.userId,
        ],
      });
    },
  });
}
