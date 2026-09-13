import { describe, it, expect, vi } from 'vitest';
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));
vi.mock('@/lib/stack-trace-reporter', () => ({
    reportStackTrace: vi.fn(),
}));

import { handleFetch } from '@/lib/http-client';
import { redirect } from 'next/navigation';

describe('handleFetch', () => {
    it('should trigger error logic when response is not ok', () => {
        const fakeResponse = {
            ok: false,
            status: 500,
            url: '/test-endpoint',
            json: vi.fn(),
        } as unknown as Response;

        handleFetch(fakeResponse, 'GET');

        expect(redirect).toHaveBeenCalledWith('/error');
    });
});
