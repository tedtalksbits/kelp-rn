import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/libs/supabase/supabase';

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
