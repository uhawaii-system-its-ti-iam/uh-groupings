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

// 用 useState 模拟 useOptimistic
vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useOptimistic: (initial: any) => {
            const [data, setData] = actual.useState(initial);
            return [data, setData]; // [optimisticData, applyOptimistic]
        },
    };
});

vi.mock('@/lib/actions', () => ({
    addAdmin: vi.fn(),
    removeAdmin: vi.fn(),
}));

// AddAdmin：固定新增 aaa-Admin，保证按 name 排序后在第一页最前面
vi.mock('@/app/admin/_components/admin-table/table-element/add-admin', () => ({
    __esModule: true,
    default: ({ onOptimisticAdd }: any) => (
        <button
            onClick={() =>
                onOptimisticAdd({
                    uid: 'new-admin',
                    name: 'aaa-Admin',
                    uhUuid: 'uuid-new',
                })
            }
        >
            MockAddAdmin
        </button>
    ),
}));

vi.mock('@/app/admin/_components/admin-table/table-element/admin-table-columns', () => ({
    __esModule: true,
    default: (onRemove: any) => [
        {
            accessorKey: 'name',
            header: 'Admin Name',
            cell: (info: any) => <div>{info.getValue()}</div>,
        },
        {
            accessorKey: 'uhUuid',
            header: 'UH Number',
            cell: (info: any) => <div>{info.getValue()}</div>,
        },
        {
            accessorKey: 'uid',
            header: 'UH Username',
            cell: (info: any) => <div>{info.getValue()}</div>,
        },
        {
            id: 'remove',
            header: 'Remove',
            cell: ({ row }: any) => (
                <button
                    data-testid={`remove-${row.original.uid}`}
                    onClick={() => onRemove(row.original)}
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
                .then(() => onSuccess?.())
                .catch(() => {
                    window.alert?.('Failed to remove admin. Please try again.');
                    onError?.();
                });
        }, 0);
        return null;
    },
}));

vi.mock('@/components/hook/useBlockNavigation.tsx', () => ({
    __esModule: true,
    default: () => ({
        BlockModalUI: null,
        setIsApiPending: vi.fn(),
    }),
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
    members: Array.from({ length: 50 }, (_, i) => ({
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
            expect(
                screen.getByPlaceholderText('Filter Admins...')
            ).toBeInTheDocument();
        });

        expect(screen.getByText('Admin Name')).toBeInTheDocument();
        expect(screen.getByText('UH Number')).toBeInTheDocument();
        expect(screen.getByText('UH Username')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<AdminTable groupingGroupMembers={mockData} />);

        const filterInput =
            screen.getByPlaceholderText('Filter Admins...');

        fireEvent.change(filterInput, {
            target: { value: mockData.members[1].name },
        });

        expect(
            screen.getByText(mockData.members[1].name)
        ).toBeInTheDocument();
        expect(
            screen.queryByText(mockData.members[0].name)
        ).not.toBeInTheDocument();
    });

    it('adds a new admin optimistically', async () => {
        (addAdmin as any).mockResolvedValue({});

        render(<AdminTable groupingGroupMembers={mockData} />);

        await userEvent.click(screen.getByText('MockAddAdmin'));

        await waitFor(() => {
            expect(addAdmin).toHaveBeenCalledWith('new-admin');
            expect(routerRefreshMock).toHaveBeenCalled();
        });
    });

    it('rolls back UI when addAdmin fails', async () => {
        (addAdmin as any).mockRejectedValue(new Error('Network error'));
        const alertMock = vi
            .spyOn(window, 'alert')
            .mockImplementation(() => {});
        const { unmount } = render(
            <AdminTable groupingGroupMembers={mockData} />
        );
        const firstOriginal = mockData.members[0].name;
        expect(screen.getByText(firstOriginal)).toBeInTheDocument();
        await userEvent.click(screen.getByText('MockAddAdmin'));
        await waitFor(() => {
            expect(
                screen.getByText('aaa-Admin')
            ).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(addAdmin).toHaveBeenCalledWith('new-admin');
            expect(routerRefreshMock).toHaveBeenCalled();
            expect(alertMock).toHaveBeenCalledWith('Failed to add admin.');
        });
        unmount();
        render(<AdminTable groupingGroupMembers={mockData} />);
        expect(
            screen.queryByText('aaa-Admin')
        ).not.toBeInTheDocument();
        expect(screen.getByText(firstOriginal)).toBeInTheDocument();
        alertMock.mockRestore();
    });

    it('removes an admin optimistically', async () => {
        (removeAdmin as any).mockResolvedValue({});

        render(<AdminTable groupingGroupMembers={mockData} />);

        const targetUid = mockData.members[0].uid;

        await userEvent.click(
            screen.getByTestId(`remove-${targetUid}`)
        );

        await waitFor(() => {
            expect(removeAdmin).toHaveBeenCalledWith(targetUid);
            expect(routerRefreshMock).toHaveBeenCalled();
        });
    });

    it('rolls back UI when removeAdmin fails', async () => {
        (removeAdmin as any).mockRejectedValue(new Error('Network error'));
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        const { unmount } = render(<AdminTable groupingGroupMembers={mockData} />);
        const removedName = mockData.members[0].name;
        const removedUid  = mockData.members[0].uid;
        expect(screen.getByText(removedName)).toBeInTheDocument();
        await userEvent.click(screen.getByTestId(`remove-${removedUid}`));
        await waitFor(() => {
            expect(screen.queryByText(removedName)).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(removeAdmin).toHaveBeenCalledWith(removedUid);
            expect(alertMock).toHaveBeenCalledWith('Failed to remove admin. Please try again.');
            expect(routerRefreshMock).toHaveBeenCalled();
        });
        unmount();
        render(<AdminTable groupingGroupMembers={mockData} />);
        expect(screen.getByText(removedName)).toBeInTheDocument();
        alertMock.mockRestore();
    });
});
