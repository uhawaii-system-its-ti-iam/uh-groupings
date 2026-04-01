import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { GroupingGroupMember } from '@/lib/types';

describe('RemoveMemberModal', () => {
    let mockAction: ReturnType<typeof vi.fn>;
    let mockRefresh: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAction = vi.fn();
        mockRefresh = vi.fn();
        vi.clearAllMocks();
    });

    it('should render trash icon with tooltip', () => {
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
            />
        );

        const trashIcon = screen.getByTestId('remove-member-icon');
        expect(trashIcon).toBeInTheDocument();
        expect(trashIcon).toHaveClass('h-5', 'w-5', 'text-red-600', 'cursor-pointer');
    });

    it('should open modal when trash icon is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
            />
        );

        await user.click(screen.getByTestId('remove-member-icon'));

        expect(screen.getByText('Remove Member')).toBeInTheDocument();
        expect(screen.getByText(/You are about to remove the following member/)).toBeInTheDocument();
    });

    it('should render and open the modal when trash icon is clicked', async () => {
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

        expect(screen.getByText('Remove Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('should call action with uid and refresh router when Yes is clicked', async () => {
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

        await user.click(screen.getByTestId('remove-member-icon'));
        await user.click(screen.getByRole('button', { name: 'Yes' }));

        expect(mockAction).toHaveBeenCalledWith('test-uid');
        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should close modal after confirming removal', async () => {
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

        await user.click(screen.getByTestId('remove-member-icon'));
        await user.click(screen.getByRole('button', { name: 'Yes' }));

        expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
    });

    it('should close modal when Cancel is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
            />
        );

        await user.click(screen.getByTestId('remove-member-icon'));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        expect(mockAction).not.toHaveBeenCalled();
    });

    it('should display warning alert about membership delay', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
            />
        );

        await user.click(screen.getByTestId('remove-member-icon'));

        expect(screen.getByText(/Membership changes made may not take effect immediately/)).toBeInTheDocument();
        expect(screen.getByText(/3-5 minutes/)).toBeInTheDocument();
    });
});
