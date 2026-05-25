import '@testing-library/jest-dom/vitest';
import { loadEnvConfig } from '@next/env';
import { afterEach, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import type { FC, ReactNode } from 'react';

createFetchMock(vi).enableMocks();
loadEnvConfig(process.cwd());

/**
 * jsdom does not implement ResizeObserver, but Radix UI primitives (Switch,
 * Tooltip, Popover, DropdownMenu, etc.) require it. Install a no-op shim once
 * globally so every test file gets it for free; individual test files no longer
 * need a per-file `beforeAll` block.
 *
 * Reference: https://radix-ui.com/primitives/docs/overview/internals
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
    // The methods below are required by the `ResizeObserver` interface used by
    // Radix UI primitives. They intentionally do nothing in tests; IntelliJ's
    // "unused method" inspection is silenced because removing them would break
    // the interface contract.
    // noinspection JSUnusedGlobalSymbols
    class ResizeObserverShim {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    }
    globalThis.ResizeObserver = ResizeObserverShim as unknown as typeof ResizeObserver;
}

/**
 * Provide a minimal in-memory localStorage implementation when jsdom does not
 * supply one. Required by hooks like `usehooks-ts` `useLocalStorage`.
 */
if (typeof window !== 'undefined') {
    const ls = window.localStorage as Storage | undefined;
    if (!ls || typeof ls.getItem !== 'function') {
        const store = new Map<string, string>();
        const memoryStorage: Storage = {
            get length() {
                return store.size;
            },
            clear: () => store.clear(),
            getItem: (key) => (store.has(key) ? (store.get(key) as string) : null),
            key: (index) => Array.from(store.keys())[index] ?? null,
            removeItem: (key) => {
                store.delete(key);
            },
            setItem: (key, value) => {
                store.set(key, String(value));
            }
        };
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: memoryStorage
        });
    }
}

// Reset localStorage between tests so shared keys (e.g. `columnVisibility`)
// do not leak state across test files.
afterEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.clear();
        } catch {
            // ignore
        }
    }
});

export const createMockProviders = (searchParams?: string, onUrlUpdate?: OnUrlUpdateFunction) => {
    const MockProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
