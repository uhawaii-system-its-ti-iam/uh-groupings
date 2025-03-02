import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddMemberModal from '@/components/modal/add-member-modal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

describe('AddMemberModal', () => {
    let mockAction: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAction = vi.fn().mockResolvedValue(undefined);
        mockOnClose = vi.fn();
        mockOnSuccess = vi.fn();
        vi.clearAllMocks();
    });

    it('renders the modal with user info', async () => {
        const user = userEvent.setup();
        render(
            <AddMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await user.tab();

        expect(screen.getByTestId('add-member-modal')).toBeInTheDocument();
        expect(screen.getByText('Add Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('adds member on "Yes" and shows success modal', async () => {
        const user = userEvent.setup();
        render(
            <AddMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Yes' }));

        expect(mockAction).toHaveBeenCalledWith('test-uid');
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(
            await screen.findByText('test-user has been successfully added to test-group list.')
        ).toBeInTheDocument();
    });

    it('closes modal on "Cancel"', async () => {
        const user = userEvent.setup();
        render(
            <AddMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await user.click(cancelButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes dynamic modal on OK click', async () => {
        const user = userEvent.setup();
        render(
            <AddMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="test-uhUuid"
                group="test-group"
                action={mockAction}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Yes' }));
        const okButton = await screen.findByRole('button', { name: 'OK' });
        await user.click(okButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
