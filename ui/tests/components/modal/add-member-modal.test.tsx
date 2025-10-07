import { render, screen } from '@testing-library/react';
import AddMemberModal from '@/components/modal/add-member-modal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('AddMemberModal', () => {
    let mockConfirm: ReturnType<typeof vi.fn>;
    let mockClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockConfirm = vi.fn();
        mockClose = vi.fn();
        vi.clearAllMocks();
    });

    const renderModal = () =>
        render(
            <AddMemberModal
                open={true}
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                onConfirm={mockConfirm}
                onClose={mockClose}
            />
        );

    it('renders the modal with user info', () => {
        renderModal();

        expect(screen.getByTestId('add-member-modal')).toBeInTheDocument();
        expect(screen.getByText('Add Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('calls onConfirm when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByRole('button', { name: 'Yes' }));

        expect(mockConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when "Cancel" is clicked', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(mockClose).toHaveBeenCalled();
    });
});
