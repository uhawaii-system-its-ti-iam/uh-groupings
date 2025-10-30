import { describe, it, vi, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createAdminColumns from '@/app/admin/_components/admin-table/table-element/admin-table-columns';
import { GroupingGroupMember } from '@/lib/types';

// Mock next/navigation for useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}));

describe('createAdminColumns', () => {
    afterEach(() => {
        cleanup();
    });

    it('should call onOptimisticRemove with correct uid when confirmed in RemoveMemberModal', async () => {
        const user = userEvent.setup();
        const mockRemove = vi.fn();

        const columns = createAdminColumns(mockRemove);
        const removeColumn = columns.find(col => col.header === 'Remove');
        if (!removeColumn || !removeColumn.cell) throw new Error('Remove column not found');

        const mockRow = {
            getValue: (key: keyof GroupingGroupMember) => {
                const fakeData = {
                    name: 'Test Admin',
                    uhUuid: '11111111',
                    uid: 'test-uid',
                };
                return fakeData[key];
            },
        };

        render(removeColumn.cell({ row: mockRow } as any));

        await user.click(screen.getByTestId('remove-member-icon'));
        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockRemove).toHaveBeenCalledTimes(1);
        expect(mockRemove).toHaveBeenCalledWith('test-uid');
    });

    it('should render all columns correctly', () => {
        const mockRemove = vi.fn();
        const columns = createAdminColumns(mockRemove);

        const row = {
            getValue: (key: keyof GroupingGroupMember) => ({
                name: 'Test Admin',
                uhUuid: '11111111',
                uid: 'test-uid',
            }[key]),
        };

        columns.forEach((col) => {
            if (col.cell) {
                render(col.cell({ row } as any));
                if (col.header === 'Admin Name') expect(screen.getByText('Test Admin')).toBeInTheDocument();
                if (col.header === 'UH Number') expect(screen.getByText('11111111')).toBeInTheDocument();
                if (col.header === 'UH Username') expect(screen.getByText('test-uid')).toBeInTheDocument();
                cleanup();
            }
        });
    });
});
