import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminTable from '@/app/admin/_components/admin-table/admin-table';
import userEvent from '@testing-library/user-event';
import { addAdmin, removeAdmin } from '@/lib/actions';
import React from 'react';

const routerRefreshMock = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: routerRefreshMock,
    }),
}));

vi.mock('@/lib/actions', () => ({
    addAdmin: vi.fn(),
    removeAdmin: vi.fn(),
}));

vi.mock('@/app/admin/_components/admin-table/table-element/add-admin', () => ({
    __esModule: true,
    default: ({ onOptimisticAdd }: any) => (
        <button onClick={() => onOptimisticAdd({ uid: 'new-admin', name: 'Test Admin', uhUuid: 'uuid-new' })}>
            MockAddAdmin
        </button>
    ),
}));

vi.mock('@/app/admin/_components/admin-table/table-element/admin-table-columns', () => ({
    __esModule: true,
    default: (onOptimisticRemove: (uid: string) => Promise<void>) => [
        {
            accessorKey: 'name',
            header: 'Admin Name',
            cell: (info: any) => <div className="pl-2 leading-relaxed">{info.getValue()}</div>,
        },
        {
            accessorKey: 'uhUuid',
            header: 'UH Number',
            cell: (info: any) => <div className="pl-2 leading-relaxed">{info.getValue()}</div>,
        },
        {
            accessorKey: 'uid',
            header: 'UH Username',
            cell: (info: any) => <div className="pl-2 leading-relaxed">{info.getValue()}</div>,
        },
        {
            id: 'remove',
            header: 'Remove',
            cell: ({ row }: any) => (
                <button
                    data-testid={`remove-${row.original.uid}`}
                    onClick={() => onOptimisticRemove(row.original)}
                >
                    Remove
                </button>
            ),
        },
    ],
}));

vi.mock('@/components/modal/remove-member-modal', () => ({
    __esModule: true,
    default: ({ memberToRemove, onProcessing, onSuccess, onError }: any) => {
        setTimeout(() => {
            onProcessing?.();
            removeAdmin(memberToRemove.uid)
                .then(() => {
                    onSuccess?.();
                })
                .catch(() => {
                    window.alert?.('Failed to remove admin. Please try again.');
                    onError?.();
                });
        }, 0);
        return null;
    },
}));

beforeEach(() => {
    routerRefreshMock.mockClear();
    (addAdmin as any).mockClear();
    (removeAdmin as any).mockClear();
});

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockData = {
    resultCode: 'SUCCESS',
    size: pageSize,
    groupPath: 'example:groupingAdmins',
    members: Array.from({ length: 200 }, (_, i) => ({
        resultCode: 'SUCCESS',
        name: `name-example-${i}`,
        uhUuid: `uhUuid-example-${i}`,
        uid: `uid-example-${i}`,
        firstName: `firstName-example-${i}`,
        lastName: `lastName-example-${i}`,
    })),
};

describe('AdminTable', () => {
    it('renders the table correctly', async () => {
        render(<AdminTable groupingGroupMembers={mockData} />);
        expect(screen.getByText('Manage Admins')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Filter Admins...')).toBeInTheDocument();
        });
        expect(screen.getByText('Admin Name')).toBeInTheDocument();
        expect(screen.getByText('UH Number')).toBeInTheDocument();
        expect(screen.queryByText('UH Username')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.members.length);
        const firstPageAdmins = mockData.members.slice(0, pageSize);
        firstPageAdmins.forEach((admin) => {
            expect(screen.getByText(admin.name)).toBeInTheDocument();
            expect(screen.getByText(admin.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(admin.uid)).toBeInTheDocument();
        });
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<AdminTable groupingGroupMembers={mockData} />);
        const filterInput = screen.getByPlaceholderText('Filter Admins...');
        fireEvent.change(filterInput, { target: { value: mockData.members[1].name } });
        expect(screen.getByText(mockData.members[1].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData.members[0].name)).not.toBeInTheDocument();
        fireEvent.change(filterInput, { target: { value: mockData.members[0].name } });
        expect(screen.getByText(mockData.members[0].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData.members[1].name)).not.toBeInTheDocument();
    });

    it(
        'sorts data when header is clicked',
        async () => {
            const clickAndWaitForSorting = async (headerText: string, expectedOrder: string[], isAscending = true) => {
                fireEvent.click(screen.getByText(headerText));
                await waitFor(() => {
                    const chevronIcon = screen.getByTestId(isAscending ? 'chevron-down-icon' : 'chevron-up-icon');
                    expect(chevronIcon).toBeInTheDocument();
                });
                const rows = screen.getAllByRole('row');
                expectedOrder.forEach((item, index) => {
                    expect(rows[index + 1]).toHaveTextContent(item);
                });
            };
            render(<AdminTable groupingGroupMembers={mockData} />);
            const user = userEvent.setup();
            await clickAndWaitForSorting(
                'Admin Name',
                [mockData.members[mockData.members.length - 1].name, mockData.members[mockData.members.length - 2].name],
                false
            );
            await clickAndWaitForSorting('Admin Name', [mockData.members[0].name, mockData.members[1].name], true);
            await clickAndWaitForSorting('UH Number', [mockData.members[0].uhUuid, mockData.members[1].uhUuid], true);
            await clickAndWaitForSorting(
                'UH Number',
                [mockData.members[mockData.members.length - 1].uhUuid, mockData.members[mockData.members.length - 2].uhUuid],
                false
            );
            await clickAndWaitForSorting('UH Username', [mockData.members[0].uid, mockData.members[1].uid], true);
            await clickAndWaitForSorting(
                'UH Username',
                [mockData.members[mockData.members.length - 1].uid, mockData.members[mockData.members.length - 2].uid],
                false
            );
        },
        10000
    );

    it('should paginate correctly', async () => {
        render(<AdminTable groupingGroupMembers={mockData} />);
        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1);
            expect(screen.getByText(`name-example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`name-example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', mockData.members.length - pageSize, mockData.members.length - 1);
        await checkPageContent(
            'Previous',
            mockData.members.length - pageSize * 2,
            mockData.members.length - pageSize - 1
        );
    });

    it('adds a new admin optimistically', async () => {
        (addAdmin as any).mockResolvedValue({});
        render(<AdminTable groupingGroupMembers={mockData} />);
        const button = screen.getByText('MockAddAdmin');
        await userEvent.click(button);
        await waitFor(() => {
            expect(addAdmin).toHaveBeenCalledWith('new-admin');
            expect(routerRefreshMock).toHaveBeenCalled();
        });
        expect(addAdmin).toHaveBeenCalledTimes(1);
    });

    it('rolls back data when addAdmin fails', async () => {
        (addAdmin as any).mockRejectedValue(new Error('Network error'));
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(<AdminTable groupingGroupMembers={mockData} />);
        const button = screen.getByText('MockAddAdmin');
        await userEvent.click(button);
        await waitFor(() => {
            expect(addAdmin).toHaveBeenCalledWith('new-admin');
            expect(routerRefreshMock).toHaveBeenCalled();
            expect(alertMock).toHaveBeenCalledWith('Failed to add admin. Please try again.');
        });
        const rows = screen.getAllByRole('row');
        const hasNewAdmin = rows.some((r) => r.textContent?.includes('Test Admin'));
        expect(hasNewAdmin).toBe(false);
        alertMock.mockRestore();
    });

    it('removes an admin optimistically (success case)', async () => {
        (removeAdmin as any).mockResolvedValue({});
        render(<AdminTable groupingGroupMembers={mockData} />);
        const targetUid = mockData.members[0].uid;
        const targetName = mockData.members[0].name;
        const removeButton = screen.getByTestId(`remove-${targetUid}`);
        await userEvent.click(removeButton);
        await waitFor(() => {
            expect(removeAdmin).toHaveBeenCalledWith(targetUid);
            expect(routerRefreshMock).toHaveBeenCalled();
        });
        const rows = screen.getAllByRole('row');
        const stillExists = rows.some((r) => r.textContent?.includes(targetName));
        expect(stillExists).toBe(false);
    });

    it('rolls back data when removeAdmin fails', async () => {
        (removeAdmin as any).mockRejectedValue(new Error('Network error'));
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<AdminTable groupingGroupMembers={mockData} />);

        const targetUid = mockData.members[0].uid;
        const targetName = mockData.members[0].name;

        await userEvent.click(screen.getByTestId(`remove-${targetUid}`));

        await waitFor(() => {
            expect(removeAdmin).toHaveBeenCalledWith(targetUid);
            expect(alertMock).toHaveBeenCalledWith('Failed to remove admin. Please try again.');
        });

        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            const stillExists = rows.some((r) => r.textContent?.includes(targetName));
            expect(stillExists).toBe(true);
        });

        alertMock.mockRestore();
    });
});
