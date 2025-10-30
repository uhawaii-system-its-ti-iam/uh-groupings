import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveMemberModal from '@/components/modal/remove-member-modal';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn(),
    }),
}));

describe('RemoveMemberModal', () => {
    let mockAction: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAction = vi.fn();
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('should render and open modal when trash icon is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="12345678"
                group="test-group"
                action={mockAction}
            />
        );

        const trashIcon = screen.getByTestId('remove-member-icon');
        expect(trashIcon).toBeInTheDocument();

        await user.click(trashIcon);
        expect(await screen.findByText('Remove Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('12345678')).toBeInTheDocument();
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('should call action and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="12345678"
                group="test-group"
                action={mockAction}
            />
        );

        await user.click(screen.getByTestId('remove-member-icon'));
        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should close modal when "Cancel" is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                uid="test-uid"
                name="test-user"
                uhUuid="12345678"
                group="test-group"
                action={mockAction}
            />
        );

        await user.click(screen.getByTestId('remove-member-icon'));
        const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();
        await user.click(cancelButton);
        expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
    });
});
