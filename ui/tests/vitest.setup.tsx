import '@testing-library/jest-dom/vitest';
import { loadEnvConfig } from '@next/env';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

vi.mock('react', async (importOriginal) => {
    const react = await importOriginal<typeof import('react')>();
    return {
        ...react,
        cache: <T extends (...args: never[]) => unknown>(fn: T): T => {
            let result: ReturnType<T> | undefined;
            return ((...args: Parameters<T>) => (result ??= fn(...args))) as T;
        }
    };
});

createFetchMock(vi).enableMocks();
loadEnvConfig(process.cwd());

export const createMockProviders = (searchParams?: string, onUrlUpdate?: OnUrlUpdateFunction) => {
    const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const queryClient = new QueryClient();
        const NuqsTestingAdapter = withNuqsTestingAdapter({ searchParams, onUrlUpdate });

        return (
            <QueryClientProvider client={queryClient}>
                <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
            </QueryClientProvider>
        );
    };

    return MockProvider;
};
