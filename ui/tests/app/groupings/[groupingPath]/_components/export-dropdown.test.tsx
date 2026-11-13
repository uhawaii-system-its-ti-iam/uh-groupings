import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, beforeAll, it, expect } from 'vitest';
import ExportDropdown from '@/app/groupings/[groupingPath]/_components/export-dropdown';
import { getGroupingMembers } from '@/lib/actions';

vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick }: { children: any; onClick?: () => void }) => (
        <button type="button" onClick={onClick}>
            {children}
        </button>
    )
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: { children: any }) => <>{children}</>,
    Tooltip: ({ children }: { children: any }) => <>{children}</>,
    TooltipTrigger: ({ children }: { children: any }) => <>{children}</>
}));

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
                page: 1,
                size: 1000,
                sortBy: 'name',
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
                page: 1,
                size: 1000,
                sortBy: 'name',
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

    it('exports members from subsequent pages when the first page is full', async () => {
        const member = { resultCode: 'SUCCESS', lastName: 'Owner', firstName: 'Test', uid: 'owner', uhUuid: '12345678', name: 'Test Owner' };
        vi.mocked(getGroupingMembers)
            .mockResolvedValueOnce({ resultCode: 'SUCCESS', groupPath, size: 1000, members: Array(1000).fill(member) })
            .mockResolvedValueOnce({ resultCode: 'SUCCESS', groupPath, size: 1, members: [member] });
        render(<ExportDropdown groupingPath={groupPath} />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /Export Grouping/ }));
        await user.click(screen.getByText('Export All Members'));

        await waitFor(() => expect(global.URL.revokeObjectURL).toHaveBeenCalled());
        expect(getGroupingMembers).toHaveBeenCalledTimes(2);
        expect(getGroupingMembers).toHaveBeenNthCalledWith(2, groupPath, {
            page: 2, size: 1000, sortBy: 'name', isAscending: true
        });
        const csv = vi.mocked(global.URL.createObjectURL).mock.calls[0][0] as Blob;
        const text = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsText(csv);
        });
        expect(text.split('\n')).toHaveLength(1002);
    });
});
