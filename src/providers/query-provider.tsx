import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/libs/react-query/query-client';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
