import { describe, expect, it, vi } from 'vitest';
import User, { AnonymousUser } from '@/lib/access/user';
import { getUser } from '@/lib/access/user.server';
import { headers } from 'next/headers';
import { auth } from '@/auth';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('@/auth', () => ({ auth: { api: { getSession: vi.fn() } } }));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('getUser', () => {
    it('maps the Better Auth session user to the application user', async () => {
        const requestHeaders = new Headers({ cookie: 'better-auth.session_token=test-session' });
        vi.mocked(headers).mockReturnValue(requestHeaders as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({
            user: {
                uhUuid: testUser.uhUuid,
                uid: testUser.uid,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                name: testUser.name,
            },
        } as never);

        await expect(getUser()).resolves.toEqual({ ...testUser, roles: [] });
        expect(auth.api.getSession).toHaveBeenCalledWith({ headers: requestHeaders });
    });

    it('returns AnonymousUser when Better Auth has no valid session', async () => {
        vi.mocked(headers).mockReturnValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue(null as never);

        await expect(getUser()).resolves.toEqual(AnonymousUser);
    });

    it('returns AnonymousUser when session enrichment is incomplete', async () => {
        vi.mocked(headers).mockReturnValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { uid: testUser.uid } } as never);

        await expect(getUser()).resolves.toEqual(AnonymousUser);
    });

    it('uses empty names when Better Auth omits optional profile fields', async () => {
        vi.mocked(headers).mockReturnValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({
            user: { uhUuid: testUser.uhUuid, uid: testUser.uid },
        } as never);

        await expect(getUser()).resolves.toEqual({
            name: '', firstName: '', lastName: '', uid: testUser.uid, uhUuid: testUser.uhUuid, roles: [],
        });
    });
});
