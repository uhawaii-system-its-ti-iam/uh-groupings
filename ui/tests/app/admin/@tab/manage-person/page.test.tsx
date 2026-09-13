import PersonTab from '@/app/admin/@tab/manage-person/page';
import * as Actions from '@/lib/actions';
import * as Fetchers from '@/lib/fetchers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/actions');
vi.mock('@/lib/fetchers');

describe('PersonTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not call member endpoints before an identifier is entered', async () => {
        await PersonTab({ searchParams: {} });

        expect(Fetchers.managePersonResults).not.toHaveBeenCalled();
        expect(Actions.memberAttributeResults).not.toHaveBeenCalled();
    });

    it('trims an identifier before requesting its memberships', async () => {
        vi.mocked(Fetchers.managePersonResults).mockResolvedValue({ resultCode: 'SUCCESS', results: [] });
        vi.mocked(Actions.memberAttributeResults).mockResolvedValue({ results: [] } as never);

        await PersonTab({ searchParams: { uhIdentifier: ' testiw ' } });

        expect(Fetchers.managePersonResults).toHaveBeenCalledWith('testiw');
        expect(Actions.memberAttributeResults).toHaveBeenCalledWith(['testiw']);
    });
});
