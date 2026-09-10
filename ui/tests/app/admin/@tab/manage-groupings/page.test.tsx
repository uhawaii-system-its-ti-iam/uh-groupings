import GroupingsTab from '@/app/admin/@tab/manage-groupings/page';
import * as Fetchers from '@/lib/fetchers';
import { GroupingPaths } from '@/lib/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/fetchers');

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
        await GroupingsTab();

        expect(Fetchers.getAllGroupings).toHaveBeenCalledOnce();
        expect(Fetchers.ownerGroupings).not.toHaveBeenCalled();
    });
});
