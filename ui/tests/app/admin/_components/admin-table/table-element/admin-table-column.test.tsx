import { describe, it, vi, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flexRender } from '@tanstack/react-table';
import AdminTableColumns from '@/app/admin/_components/admin-table/table-element/admin-table-columns';
import { GroupingGroupMember } from '@/lib/types';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}));

vi.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: any) => <>{children}</>,
    Tooltip: ({ children }: any) => <>{children}</>,
    TooltipTrigger: ({ children, asChild }: any) => (asChild ? children : <div>{children}</div>),
    TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}));

vi.mock('@/lib/messages', () => ({
    message: {
        Actions: {
            Trashcan_Admin: 'Remove this admin',
        },
        RemoveMemberModals: {
            TOOLTIP: {
                NO_UID_MULTIPLE: 'This person does not have a UH username.',
            },
        },
    },
}));

describe('AdminTableColumns', () => {
    afterEach(() => {
        cleanup();
    });

    it('calls onOpenModal with the full member when trash icon is clicked', async () => {
        const user = userEvent.setup();
        const onOpenModal = vi.fn();

        const columns = AdminTableColumns(onOpenModal);
        const removeColumn = columns.find(col => col.header === 'Remove');
        if (!removeColumn || !removeColumn.cell) throw new Error('Remove column not found');

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: 'test-uid',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const mockRow = {
            original: member,
        };

        render(<>{flexRender(removeColumn.cell, { row: mockRow } as never)}</>);
        await user.click(screen.getByTestId('remove-user-11111111'));

        expect(onOpenModal).toHaveBeenCalledTimes(1);
        expect(onOpenModal).toHaveBeenCalledWith(member);
    });

    it('renders all columns correctly', () => {
        const onOpenModal = vi.fn();
        const columns = AdminTableColumns(onOpenModal);

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: 'test-uid',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const row = {
            original: member,
        };

        columns.forEach((col) => {
            if (col.cell) {
                render(<>{flexRender(col.cell, { row } as never)}</>);

                if (col.header === 'Admin Name')
                    expect(screen.getByText('Test Admin')).toBeInTheDocument();

                if (col.header === 'UH Number')
                    expect(screen.getByText('11111111')).toBeInTheDocument();

                if (col.header === 'UH Username')
                    expect(screen.getByText('test-uid')).toBeInTheDocument();
            }
        });
    });

    it('displays N/A text when uid is empty', () => {
        const onOpenModal = vi.fn();
        const columns = AdminTableColumns(onOpenModal);
        const uidColumn = columns.find(col => col.header === 'UH Username');
        if (!uidColumn || !uidColumn.cell) throw new Error('UH Username column not found');

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: '',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const mockRow = {
            original: member,
        };

        render(<>{flexRender(uidColumn.cell, { row: mockRow } as never)}</>);

        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays question circle icon button when uid is empty', () => {
        const onOpenModal = vi.fn();
        const columns = AdminTableColumns(onOpenModal);
        const uidColumn = columns.find(col => col.header === 'UH Username');
        if (!uidColumn || !uidColumn.cell) throw new Error('UH Username column not found');

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: '',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const mockRow = {
            original: member,
        };

        render(<>{flexRender(uidColumn.cell, { row: mockRow } as never)}</>);

        const questionButton = screen.getByLabelText('UH Username not available');
        expect(questionButton).toBeInTheDocument();
    });

    it('does not display N/A when uid is present', () => {
        const onOpenModal = vi.fn();
        const columns = AdminTableColumns(onOpenModal);
        const uidColumn = columns.find(col => col.header === 'UH Username');
        if (!uidColumn || !uidColumn.cell) throw new Error('UH Username column not found');

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: 'test-uid',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const mockRow = {
            original: member,
        };

        render(<>{flexRender(uidColumn.cell, { row: mockRow } as never)}</>);

        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();
    });

    it('renders trash icon button with correct aria-label', () => {
        const onOpenModal = vi.fn();
        const columns = AdminTableColumns(onOpenModal);
        const removeColumn = columns.find(col => col.header === 'Remove');
        if (!removeColumn || !removeColumn.cell) throw new Error('Remove column not found');

        const member: GroupingGroupMember = {
            name: 'Test Admin',
            uhUuid: '11111111',
            uid: 'test-uid',
            firstName: 'Test',
            lastName: 'Admin',
            resultCode: 'SUCCESS',
        };

        const mockRow = {
            original: member,
        };

        render(<>{flexRender(removeColumn.cell, { row: mockRow } as never)}</>);

        const button = screen.getByLabelText(/Remove Test Admin as admin/);
        expect(button).toBeInTheDocument();
    });
});
