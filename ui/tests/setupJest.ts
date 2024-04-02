import '@testing-library/jest-dom';
import { loadEnvConfig } from '@next/env';
import { enableFetchMocks } from 'jest-fetch-mock';
import User from '@/access/User';

enableFetchMocks();
loadEnvConfig(process.cwd());

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

export const createMockSession = (user: User | undefined) => ({
    user,
    destroy: jest.fn(),
    save: jest.fn(),
    updateConfig: jest.fn()
});
