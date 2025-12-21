'use client';

import type {
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate,
} from '@/libs/supabase/types/database.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/libs/supabase/supabase';

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let userId = user?.id;
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('kelp_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UserProfileInsert>({
    mutationFn: async (profile: UserProfileInsert) => {
      const { data, error } = await supabase
        .from('kelp_user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfile,
    Error,
    { userId: string; updates: UserProfileUpdate }
  >({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: UserProfileUpdate;
    }) => {
      const { data, error } = await supabase
        .from('kelp_user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
