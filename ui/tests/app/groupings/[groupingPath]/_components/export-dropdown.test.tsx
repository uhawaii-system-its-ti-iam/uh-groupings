import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, beforeAll, it, expect } from 'vitest';
import ExportDropdown from '@/app/groupings/[groupingPath]/_components/export-dropdown';
import { getGroupingMembers } from '@/lib/actions';

vi.mock('@/lib/actions', () => ({
    getGroupingMembers: vi.fn().mockResolvedValue({
        members: [
            { lastName: 'lstName1', firstName: 'firstName1', uid: 'uid1', uhUuid: '1234' },
            { lastName: 'lastName2', firstName: 'firstName2', uid: '', uhUuid: '5678' }
        ]
    })
}));

describe('ExportDropdown', () => {
    const groupPath = 'test-groupPath';
    const createObjectURLSpy = vi.fn().mockReturnValue('mock-url');
    const revokeObjectURLSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => {
        global.URL.createObjectURL = vi.fn();
        global.URL.revokeObjectURL = vi.fn();
    });

    it('should call fetchGroupData and generate download link when exporting all members', async () => {
        render(<ExportDropdown groupingPath={groupPath} />);
        const user = userEvent.setup();

        global.URL.createObjectURL = createObjectURLSpy;
        global.URL.revokeObjectURL = revokeObjectURLSpy;

        const button = screen.getByRole('button', { name: /Export Grouping/ });
        await user.click(button);

        const exportAllButton = screen.getByText('Export All Members');
        await user.click(exportAllButton);

        await waitFor(() => {
            expect(getGroupingMembers).toHaveBeenCalledWith('test-groupPath', {
                sortString: 'name',
                isAscending: true
            });
        });

        expect(createObjectURLSpy).toHaveBeenCalled();
        const link = document.createElement('a');
        link.href = 'mock-url';
        link.download = 'test-groupPath_members_list.csv';
        link.click();

        expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should call fetchGroupData and generate download link when exporting basis', async () => {
        render(<ExportDropdown groupingPath={groupPath} />);
        const user = userEvent.setup();

        global.URL.createObjectURL = createObjectURLSpy;
        global.URL.revokeObjectURL = revokeObjectURLSpy;

        const button = screen.getByRole('button', { name: /Export Grouping/ });
        await user.click(button);

        const exportBasisButton = screen.getByText('Export Basis');
        await user.click(exportBasisButton);

        await waitFor(() => {
            expect(getGroupingMembers).toHaveBeenCalledWith('test-groupPath:basis', {
                sortString: 'name',
                isAscending: true
            });
        });

        expect(createObjectURLSpy).toHaveBeenCalled();
        const link = document.createElement('a');
        link.href = 'mock-url';
        link.download = 'test-groupPath_basis_list.csv';
        link.click();

        expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
});
