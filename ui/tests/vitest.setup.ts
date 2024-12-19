import '@testing-library/jest-dom/vitest';
import { loadEnvConfig } from '@next/env';
import User from '@/lib/access/user';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

createFetchMock(vi).enableMocks();
loadEnvConfig(process.cwd());

export const createMockSession = (user: User | undefined) => ({
    user,
    destroy: vi.fn(),
    save: vi.fn(),
    updateConfig: vi.fn()
});
