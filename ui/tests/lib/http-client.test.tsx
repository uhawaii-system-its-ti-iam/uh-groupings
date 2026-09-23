import { beforeEach, describe, it, expect, vi } from 'vitest';
vi.mock('next/navigation', () => ({
    redirect: vi.fn()
}));
vi.mock('@/lib/stack-trace-reporter', () => ({
    reportStackTrace: vi.fn()
}));
vi.mock('@/lib/jwt-service', () => ({ generateJWT: vi.fn() }));

import {
    deleteRequest,
    deleteRequestAsync,
    getRequestWithUser,
    handleFetch,
    postRequest,
    postRequestAsync,
    putRequest,
    putRequestAsync
} from '@/lib/http-client';
import { redirect } from 'next/navigation';
import { generateJWT } from '@/lib/jwt-service';
import User from '@/lib/access/user';

const user: User = {
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    uid: 'testiwta',
    uhUuid: '99997010',
    roles: []
};

const response = (json: unknown): Response =>
    ({ ok: true, json: vi.fn().mockResolvedValue(json) }) as unknown as Response;

describe('handleFetch', () => {
    it('should trigger error logic when response is not ok', () => {
        const fakeResponse = {
            ok: false,
            status: 500,
            url: '/test-endpoint',
            json: vi.fn()
        } as unknown as Response;

        handleFetch(fakeResponse);

        expect(redirect).toHaveBeenCalledWith('/error');
    });
});

describe('HTTP helpers with a resolved user', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(generateJWT).mockResolvedValue('test-jwt');
    });

    it.each([
        ['getRequestWithUser', () => getRequestWithUser('/endpoint', user)],
        ['postRequest', () => postRequest('/endpoint', { value: true }, 'application/json', user)],
        ['putRequest', () => putRequest('/endpoint', { value: true }, 'application/json', user)],
        ['deleteRequest', () => deleteRequest('/endpoint', { value: true }, 'application/json', user)]
    ])('%s passes its resolved user to generateJWT', async (_, request) => {
        fetchMock.mockResolvedValueOnce(response({ ok: true }));
        await request();
        expect(generateJWT).toHaveBeenCalledWith(user);
    });

    it.each([
        ['postRequestAsync', () => postRequestAsync('/endpoint', {}, 'application/json', user)],
        ['putRequestAsync', () => putRequestAsync('/endpoint', {}, 'application/json', user)],
        ['deleteRequestAsync', () => deleteRequestAsync('/endpoint', {}, 'application/json', user)]
    ])('%s passes its resolved user to generateJWT', async (_, request) => {
        fetchMock
            .mockResolvedValueOnce(response(1))
            .mockResolvedValueOnce(response({ status: 'COMPLETED', result: {} }));
        await request();
        expect(generateJWT).toHaveBeenNthCalledWith(1, user);
    });
});
