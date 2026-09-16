import GroupingsTab from '@/app/admin/@tab/manage-groupings/page';
import * as Fetchers from '@/lib/fetchers';
import { GroupingPaths } from '@/lib/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/fetchers');
vi.mock('@/lib/access/user.server', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

const mockGroupings: GroupingPaths = {
    resultCode: 'SUCCESS',
    groupingPaths: []
};

beforeEach(() => {
    vi.mocked(Fetchers.getAllGroupings).mockResolvedValue(mockGroupings);
    vi.mocked(Fetchers.ownerGroupings).mockResolvedValue(mockGroupings);
});

describe('GroupingsTab', () => {
    it("gets all groupings instead of only the current user's groupings", async () => {
        const { getUser } = await import('@/lib/access/user.server');
        const { setRoles } = await import('@/lib/access/authorization');
        const user = { uid: 'test-user', uhUuid: '12345678', roles: [] };
        vi.mocked(getUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);

        await GroupingsTab();

        expect(Fetchers.getAllGroupings).toHaveBeenCalledOnce();
        expect(Fetchers.ownerGroupings).not.toHaveBeenCalled();
    });
});
