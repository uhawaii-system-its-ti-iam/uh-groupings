import { describe, it, expect, vi } from 'vitest';
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));
vi.mock('@/lib/actions', () => ({
    sendStackTrace: vi.fn(),
}));

import { handleFetch } from '@/lib/http-client';
import { redirect } from 'next/navigation';
import { sendStackTrace } from '@/lib/actions';

describe('handleFetch', () => {
    it('should trigger error logic when response is not ok', () => {
        const fakeResponse = {
            ok: false,
            status: 500,
            url: '/test-endpoint',
            json: vi.fn(),
        } as unknown as Response;

        handleFetch(fakeResponse, 'GET');

        expect(sendStackTrace).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith('/error');
    });
});
