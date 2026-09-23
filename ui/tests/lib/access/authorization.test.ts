import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setRoles } from '@/lib/access/authorization';
import Role from '@/lib/access/role';
import User from '@/lib/access/user';
import * as Fetchers from '@/lib/fetchers';

vi.mock('@/lib/fetchers');
vi.mock('next/cache', () => ({ unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn }));

const createUser = (): User => ({
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    uid: 'testiwta',
    uhUuid: '99997010',
    roles: []
});

describe('setRoles', () => {
    beforeEach(() => vi.resetAllMocks());

    it('gives anonymous users only ANONYMOUS without calling authorization APIs', async () => {
        const result = await setRoles({ ...createUser(), uid: '', uhUuid: '' });
        expect(result.roles).toEqual([Role.ANONYMOUS]);
        expect(Fetchers.isOwner).not.toHaveBeenCalled();
        expect(Fetchers.isAdmin).not.toHaveBeenCalled();
    });

    it('does not query authorization APIs for invalid UH UUIDs', async () => {
        const result = await setRoles({ ...createUser(), uhUuid: 'invalid' });
        expect(result.roles).toEqual([Role.ANONYMOUS]);
        expect(Fetchers.isOwner).not.toHaveBeenCalled();
        expect(Fetchers.isAdmin).not.toHaveBeenCalled();
    });

    it('gives valid UH users UH and runs owner/admin checks in parallel', async () => {
        let releaseOwner!: () => void;
        const owner = new Promise<boolean>((resolve) => {
            releaseOwner = () => resolve(false);
        });
        vi.mocked(Fetchers.isOwner).mockReturnValue(owner);
        vi.mocked(Fetchers.isAdmin).mockResolvedValue(false);
        const resultPromise = setRoles(createUser());
        await Promise.resolve();
        expect(Fetchers.isOwner).toHaveBeenCalledOnce();
        expect(Fetchers.isAdmin).toHaveBeenCalledOnce();
        releaseOwner();
        await expect(resultPromise).resolves.toMatchObject({ roles: [Role.ANONYMOUS, Role.UH] });
    });

    it('adds owner and admin roles when authorized', async () => {
        vi.mocked(Fetchers.isOwner).mockResolvedValue(true);
        vi.mocked(Fetchers.isAdmin).mockResolvedValue(true);
        const result = await setRoles(createUser());
        expect(result.roles).toEqual(expect.arrayContaining([Role.ANONYMOUS, Role.UH, Role.OWNER, Role.ADMIN]));
    });

    it('does not duplicate existing roles', async () => {
        const user = { ...createUser(), roles: [Role.ANONYMOUS, Role.UH, Role.ADMIN] };
        vi.mocked(Fetchers.isOwner).mockResolvedValue(false);
        vi.mocked(Fetchers.isAdmin).mockResolvedValue(true);
        const result = await setRoles(user);
        for (const role of [Role.ANONYMOUS, Role.UH, Role.ADMIN]) {
            expect(result.roles.filter((value) => value === role)).toHaveLength(1);
        }
    });

    it('does not mutate the input roles array', async () => {
        const user = createUser();
        const originalRoles = [...user.roles];
        vi.mocked(Fetchers.isOwner).mockResolvedValue(false);
        vi.mocked(Fetchers.isAdmin).mockResolvedValue(false);
        const result = await setRoles(user);
        expect(user.roles).toEqual(originalRoles);
        expect(result.roles).toEqual(expect.arrayContaining([Role.ANONYMOUS, Role.UH]));
    });

    it('adds DEPARTMENTAL for a departmental user', async () => {
        const user = { ...createUser(), uid: '99997010' };
        vi.mocked(Fetchers.isOwner).mockResolvedValue(false);
        vi.mocked(Fetchers.isAdmin).mockResolvedValue(false);
        await expect(setRoles(user)).resolves.toMatchObject({ roles: [Role.ANONYMOUS, Role.UH, Role.DEPARTMENTAL] });
    });
});
