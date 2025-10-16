import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error: any) => {
                if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 408) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export { queryClient };