import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { GroupingGroupMember } from '@/lib/types';

describe('RemoveMemberModal', () => {
    let mockConfirm: ReturnType<typeof vi.fn>;
    let mockClose: ReturnType<typeof vi.fn>;

    const member: GroupingGroupMember = {
        uid: 'test-uid',
        name: 'test-user',
        uhUuid: 'test-uhUuid',
        firstName: 'test',
        lastName: 'user',
        resultCode: 'SUCCESS',
    };

    beforeEach(() => {
        mockConfirm = vi.fn();
        mockClose = vi.fn();
        vi.clearAllMocks();
    });

    it('renders modal content when open is true', () => {
        render(
            <RemoveMemberModal
                open={true}
                member={member}
                group="test-group"
                onConfirm={mockConfirm}
                onClose={mockClose}
            />
        );

        expect(screen.getByText('Remove Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('calls onConfirm when "Yes" is clicked', async () => {
        const user = userEvent.setup();

        render(
            <RemoveMemberModal
                open={true}
                member={member}
                group="test-group"
                onConfirm={mockConfirm}
                onClose={mockClose}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Yes' }));

        expect(mockConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when "Cancel" is clicked', async () => {
        const user = userEvent.setup();

        render(
            <RemoveMemberModal
                open={true}
                member={member}
                group="test-group"
                onConfirm={mockConfirm}
                onClose={mockClose}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(mockClose).toHaveBeenCalledTimes(1);
    });
});
