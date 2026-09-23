import { beforeEach, describe, expect, it, vi } from 'vitest';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { setRoles } from '@/lib/access/authorization';
import Role from '@/lib/access/role';
import User, { AnonymousUser } from '@/lib/access/user';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('@/auth', () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

let getUser: () => Promise<User>;
let getAuthorizedUser: () => Promise<User>;

const sessionUser = (): User => ({
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    uid: 'testiwta',
    uhUuid: '99997010',
    roles: []
});

describe('request-scoped user resolution', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        ({ getUser, getAuthorizedUser } = await import('@/lib/access/user.server'));
    });

    it('maps a Better Auth session user to the application User', async () => {
        const user = sessionUser();
        const requestHeaders = new Headers({ cookie: 'better-auth.session_token=test-session' });
        vi.mocked(headers).mockResolvedValue(requestHeaders as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({ user } as never);
        await expect(getUser()).resolves.toEqual(user);
        expect(auth.api.getSession).toHaveBeenCalledWith({ headers: requestHeaders });
    });

    it('uses empty strings when optional Better Auth profile names are absent', async () => {
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({
            user: { uid: 'testiwta', uhUuid: '99997010' }
        } as never);

        await expect(getUser()).resolves.toEqual({
            uid: 'testiwta',
            uhUuid: '99997010',
            name: '',
            firstName: '',
            lastName: '',
            roles: []
        });
    });

    it('returns AnonymousUser when there is no session', async () => {
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
        await expect(getUser()).resolves.toEqual(AnonymousUser);
    });

    it('returns AnonymousUser when uid or uhUuid is missing', async () => {
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { uid: 'testiwta' } } as never);
        await expect(getUser()).resolves.toEqual(AnonymousUser);
    });

    it('enriches the session user with roles', async () => {
        const user = sessionUser();
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({ user } as never);
        vi.mocked(setRoles).mockResolvedValue({ ...user, roles: [Role.ANONYMOUS, Role.UH] });
        await expect(getAuthorizedUser()).resolves.toEqual({ ...user, roles: [Role.ANONYMOUS, Role.UH] });
        expect(setRoles).toHaveBeenCalledOnce();
    });

    it('does not resolve the session more than once within a request', async () => {
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue(null as never);
        await getUser();
        await getUser();
        expect(auth.api.getSession).toHaveBeenCalledOnce();
    });

    it('does not enrich roles more than once within a request', async () => {
        const user = sessionUser();
        vi.mocked(headers).mockResolvedValue(new Headers() as never);
        vi.mocked(auth.api.getSession).mockResolvedValue({ user } as never);
        vi.mocked(setRoles).mockResolvedValue(user);
        await getAuthorizedUser();
        await getAuthorizedUser();
        expect(setRoles).toHaveBeenCalledOnce();
    });
});
