import { describe, it, vi, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTableColumns from '@/app/admin/_components/admin-table/table-element/admin-table-columns';
import { GroupingGroupMember } from '@/lib/types';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
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

        render(removeColumn.cell({ row: mockRow } as any));
        await user.click(screen.getByTestId('remove-user-test-uid'));

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
                render(col.cell({ row } as any));

                if (col.header === 'Admin Name')
                    expect(screen.getByText('Test Admin')).toBeInTheDocument();

                if (col.header === 'UH Number')
                    expect(screen.getByText('11111111')).toBeInTheDocument();

                if (col.header === 'UH Username')
                    expect(screen.getByText('test-uid')).toBeInTheDocument();

                cleanup();
            }
        });
    });
});
