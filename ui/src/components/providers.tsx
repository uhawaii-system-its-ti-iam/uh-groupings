'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false
            }
        }
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
