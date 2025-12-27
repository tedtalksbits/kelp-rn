'use client';

import { supabase } from '@/libs/supabase/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(['auth-user'], null);
    queryClient.invalidateQueries({ queryKey: ['auth-user'] });
  };

  return {
    ...query,
    signOut,
  };
}

interface SignInData {
  email: string;
  password: string;
}

export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password }: SignInData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    },
  });
};
