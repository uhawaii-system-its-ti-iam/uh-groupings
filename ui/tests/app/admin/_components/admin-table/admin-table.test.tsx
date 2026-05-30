import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTable from '@/app/admin/_components/admin-table/admin-table';
const refreshMock = vi.hoisted(() => vi.fn());
const addAdminMock = vi.hoisted(() => vi.fn());
const removeAdminMock = vi.hoisted(() => vi.fn());
const memberAttributeResultsMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: refreshMock
    })
}));

vi.mock('@/lib/actions', () => ({
    addAdmin: addAdminMock,
    removeAdmin: removeAdminMock,
    memberAttributeResults: memberAttributeResultsMock
}));

vi.mock('@/components/ui/spinner', () => ({
    Spinner: () => <div data-testid="spinner" />
}));

vi.mock('@/components/modal/dynamic-modal', () => ({
    default: ({ open, title, body, closeText = 'OK', onClose }: any) =>
        open ? (
            <div data-testid="success-modal">
                <div>{title}</div>
                <div>{body}</div>
                <button onClick={onClose}>{closeText}</button>
            </div>
        ) : null
}));

vi.mock('@/components/modal/remove-member-modal', () => ({
    default: ({ isOpen, memberToRemove, group, groupingPath, onClose, onSuccess, onProcessing }: any) =>
        isOpen ? (
            <div data-testid="remove-member-modal">
                <div>Remove Member</div>
                <div>{group}</div>
                <div>{memberToRemove.name}</div>
                <button
                    onClick={async () => {
                        onProcessing();
                        try {
                            await removeAdminMock(memberToRemove.uid);
                            onSuccess();
                            onClose();
                        } catch (error) {
                            console.error('Error removing member:', error);
                        }
                    }}
                >
                    Yes
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        ) : null
}));

vi.mock('@/components/modal/add-member-modal', () => ({
    default: ({ open, uid, name, uhUuid, group, onConfirm, onClose }: any) =>
        open ? (
            <div data-testid="add-member-modal">
                <div>Add Member</div>
                <div>{group}</div>
                <div>{name}</div>
                <div>{uhUuid}</div>
                <div>{uid}</div>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        ) : null
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: any) => <>{children}</>,
    Tooltip: ({ children }: never) => <>{children}</>,
    TooltipTrigger: ({ children, asChild }: never) => (asChild ? children : <div>{children}</div>),
    TooltipContent: ({ children }: never) => <div data-testid="tooltip-content">{children}</div>,
}));

vi.mock('@/lib/messages', () => ({
    message: {
        AdminTable: {
            SUCCESS: {
                ADD_TITLE: 'Add Success',
                ADD_BODY: (name: string) => `Added ${name}`,
                REMOVE_TITLE: 'Remove Success',
                REMOVE_BODY: (name: string) => `Removed ${name}`,
            },
        },
        Actions: {
            Trashcan_Admin: 'Remove this admin',
        },
        RemoveMemberModals: {
            TOOLTIP: {
                NO_UID_SINGLE: 'This member does not have a UH username.',
                NO_UID_MULTIPLE: 'This person does not have a UH username.',
            },
        },
    },
}));

function deferred<T = void>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: never) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

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
        lastName: `lastName-example-${i}`
    }))
};

beforeEach(() => {
    vi.clearAllMocks();
});

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
        await waitFor(() => {
            expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        });

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.members.length);

        const firstPageAdmins = mockData.members.slice(0, pageSize);
        firstPageAdmins.forEach((admin) => {
            expect(screen.getByText(admin.name)).toBeInTheDocument();
            expect(screen.getByText(admin.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(admin.uid)).toBeInTheDocument();
        });

        // Check for pagination
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

    it('sorts data when header is clicked', async () => {
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
        await clickAndWaitForSorting(
            'Admin Name',
            [mockData.members[mockData.members.length - 1].name, mockData.members[mockData.members.length - 2].name],
            false
        );
        await clickAndWaitForSorting('Admin Name', [mockData.members[0].name, mockData.members[1].name], true);
        await clickAndWaitForSorting('UH Number', [mockData.members[0].uhUuid, mockData.members[1].uhUuid], true);
        await clickAndWaitForSorting(
            'UH Number',
            [
                mockData.members[mockData.members.length - 1].uhUuid,
                mockData.members[mockData.members.length - 2].uhUuid
            ],
            false
        );
        await clickAndWaitForSorting('UH Username', [mockData.members[0].uid, mockData.members[1].uid], true);

        await clickAndWaitForSorting(
            'UH Username',
            [mockData.members[mockData.members.length - 1].uid, mockData.members[mockData.members.length - 2].uid],
            false
        );
    }, 10000);

    it('should paginate correctly', async () => {
        render(<AdminTable groupingGroupMembers={mockData} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
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

    it('remove flow: click trash -> open modal -> Yes calls API -> spinner -> success modal -> rerender updates table', async () => {
        const user = userEvent.setup();

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' },
            { resultCode: 'SUCCESS', uid: 'uid-2', uhUuid: '222', name: 'Bob B', firstName: 'Bob', lastName: 'B' },
            {
                resultCode: 'SUCCESS',
                uid: 'uid-3',
                uhUuid: '333',
                name: 'Charlie C',
                firstName: 'Charlie',
                lastName: 'C'
            }
        ];

        const initialData = {
            resultCode: 'SUCCESS',
            size: members.length,
            groupPath: 'example:groupingAdmins',
            members
        };

        const { rerender } = render(<AdminTable groupingGroupMembers={initialData as any} />);
        expect(await screen.findByText('Manage Admins')).toBeInTheDocument();
        expect(screen.getByText('Bob B')).toBeInTheDocument();
        const trash = screen.getByTestId('remove-user-222');
        await user.click(trash);
        const removeModal = await screen.findByTestId('remove-member-modal');
        expect(within(removeModal).getByText('Remove Member')).toBeInTheDocument();
        expect(within(removeModal).getByText('Bob B')).toBeInTheDocument();
        const d = deferred<void>();
        removeAdminMock.mockReturnValueOnce(d.promise);
        await user.click(within(removeModal).getByRole('button', { name: 'Yes' }));

        expect(removeAdminMock).toHaveBeenCalledTimes(1);
        expect(removeAdminMock).toHaveBeenCalledWith('uid-2');
        await waitFor(() => {
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
        d.resolve();
        await waitFor(() => {
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });
        const successModal = await screen.findByTestId('success-modal');
        expect(within(successModal).getByText('Remove Success')).toBeInTheDocument();
        expect(within(successModal).getByText('Removed Bob B')).toBeInTheDocument();
        expect(refreshMock).toHaveBeenCalled();
        const afterRemoveData = {
            ...initialData,
            members: members.filter((m) => m.uid !== 'uid-2')
        };

        rerender(<AdminTable groupingGroupMembers={afterRemoveData as any} />);

        await waitFor(() => {
            expect(screen.queryByText('Bob B')).not.toBeInTheDocument();
            expect(screen.getByText('Alice A')).toBeInTheDocument();
            expect(screen.getByText('Charlie C')).toBeInTheDocument();
        });
    });

    it('add flow: search -> open add modal -> Yes calls API -> spinner -> success modal -> rerender updates table', async () => {
        const user = userEvent.setup();

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' },
            { resultCode: 'SUCCESS', uid: 'uid-2', uhUuid: '222', name: 'Bob B', firstName: 'Bob', lastName: 'B' }
        ];

        const initialData = {
            resultCode: 'SUCCESS',
            size: members.length,
            groupPath: 'example:groupingAdmins',
            members
        };

        const newUser = {
            uid: 'uid-4',
            uhUuid: '444',
            name: 'David D',
            firstName: 'David',
            lastName: 'D',
            resultCode: 'SUCCESS'
        };
        memberAttributeResultsMock.mockResolvedValueOnce({
            results: [newUser]
        });
        const { rerender } = render(<AdminTable groupingGroupMembers={initialData as any} />);
        expect(await screen.findByText('Manage Admins')).toBeInTheDocument();
        expect(screen.queryByText('David D')).not.toBeInTheDocument();
        const input = screen.getByPlaceholderText('UH Username or UH Number');
        await user.type(input, 'uid-4');
        const addBtn = screen.getByRole('button', { name: 'Add' });
        await user.click(addBtn);
        await waitFor(() => {
            expect(memberAttributeResultsMock).toHaveBeenCalledTimes(1);
            expect(memberAttributeResultsMock).toHaveBeenCalledWith(['uid-4']);
        });
        const addModal = await screen.findByTestId('add-member-modal');
        expect(within(addModal).getByText('Add Member')).toBeInTheDocument();
        expect(within(addModal).getByText('David D')).toBeInTheDocument();
        const d = deferred<void>();
        addAdminMock.mockReturnValueOnce(d.promise);
        await user.click(within(addModal).getByRole('button', { name: 'Yes' }));
        expect(addAdminMock).toHaveBeenCalledTimes(1);
        expect(addAdminMock).toHaveBeenCalledWith('uid-4');
        await waitFor(() => {
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
        d.resolve();
        await waitFor(() => {
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });
        const successModal = await screen.findByTestId('success-modal');
        expect(within(successModal).getByText('Add Success')).toBeInTheDocument();
        expect(within(successModal).getByText('Added David D')).toBeInTheDocument();
        expect(refreshMock).toHaveBeenCalled();
        const afterAddData = {
            ...initialData,
            members: [...members, newUser]
        };

        rerender(<AdminTable groupingGroupMembers={afterAddData as any} />);

        await waitFor(() => {
            expect(screen.getByText('David D')).toBeInTheDocument();
        });
    });
    it('remove modal cancel branch closes modal', async () => {
        const user = userEvent.setup();

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' }
        ];

        render(
            <AdminTable
                groupingGroupMembers={
                    {
                        resultCode: 'SUCCESS',
                        size: 1,
                        groupPath: 'example:groupingAdmins',
                        members
                    } as any
                }
            />
        );

        const trash = screen.getByTestId('remove-user-111');
        await user.click(trash);

        const modal = await screen.findByTestId('remove-member-modal');
        expect(modal).toBeInTheDocument();

        await user.click(within(modal).getByText('Cancel'));

        await waitFor(() => {
            expect(screen.queryByTestId('remove-member-modal')).not.toBeInTheDocument();
        });
    });

    it('success modal close branch', async () => {
        const user = userEvent.setup();

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' }
        ];

        const { rerender } = render(
            <AdminTable
                groupingGroupMembers={
                    {
                        resultCode: 'SUCCESS',
                        size: 1,
                        groupPath: 'example:groupingAdmins',
                        members
                    } as any
                }
            />
        );

        const trash = screen.getByTestId('remove-user-111');
        await user.click(trash);

        removeAdminMock.mockResolvedValueOnce(undefined);

        const modal = await screen.findByTestId('remove-member-modal');
        await user.click(within(modal).getByText('Yes'));

        const successModal = await screen.findByTestId('success-modal');
        expect(successModal).toBeInTheDocument();

        await user.click(within(successModal).getByText('OK'));

        await waitFor(() => {
            expect(screen.queryByTestId('success-modal')).not.toBeInTheDocument();
        });

        rerender(
            <AdminTable
                groupingGroupMembers={
                    {
                        resultCode: 'SUCCESS',
                        size: 0,
                        groupPath: 'example:groupingAdmins',
                        members: []
                    } as any
                }
            />
        );
    });

    it('remove error branch logs console.error', async () => {
        const user = userEvent.setup();
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' }
        ];

        render(
            <AdminTable
                groupingGroupMembers={
                    {
                        resultCode: 'SUCCESS',
                        size: 1,
                        groupPath: 'example:groupingAdmins',
                        members
                    } as any
                }
            />
        );

        const trash = screen.getByTestId('remove-user-111');
        await user.click(trash);

        removeAdminMock.mockRejectedValueOnce(new Error('fail'));

        const modal = await screen.findByTestId('remove-member-modal');
        await user.click(within(modal).getByText('Yes'));

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });

        spy.mockRestore();
    });

    it('add error branch logs console.error', async () => {
        const user = userEvent.setup();
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const members = [
            { resultCode: 'SUCCESS', uid: 'uid-1', uhUuid: '111', name: 'Alice A', firstName: 'Alice', lastName: 'A' }
        ];

        const newUser = {
            uid: 'uid-2',
            uhUuid: '222',
            name: 'Bob B',
            firstName: 'Bob',
            lastName: 'B',
            resultCode: 'SUCCESS'
        };

        memberAttributeResultsMock.mockResolvedValueOnce({
            results: [newUser]
        });

        render(
            <AdminTable
                groupingGroupMembers={
                    {
                        resultCode: 'SUCCESS',
                        size: 1,
                        groupPath: 'example:groupingAdmins',
                        members
                    } as any
                }
            />
        );

        const input = screen.getByPlaceholderText('UH Username or UH Number');
        await user.type(input, 'uid-2');

        const addBtn = screen.getByRole('button', { name: 'Add' });
        await user.click(addBtn);

        const addModal = await screen.findByTestId('add-member-modal');

        addAdminMock.mockRejectedValueOnce(new Error('fail'));

        await user.click(within(addModal).getByText('Yes'));

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });

        spy.mockRestore();
    });

    it('handleRemoveAdmin early return branch', async () => {
        const user = userEvent.setup();

        render(<AdminTable groupingGroupMembers={mockData} />);

        removeAdminMock.mockResolvedValueOnce(undefined);

        const trash = screen.getByTestId('remove-user-uhUuid-example-0');
        await user.click(trash);

        const modal = await screen.findByTestId('remove-member-modal');

        await user.click(within(modal).getByText('Cancel'));

        await user.click(within(modal).getByText('Yes')).catch(() => {});

        expect(removeAdminMock).not.toHaveBeenCalled();
    });
});
