'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false
            }
        }
    });
    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
    );
};

export default Providers;
