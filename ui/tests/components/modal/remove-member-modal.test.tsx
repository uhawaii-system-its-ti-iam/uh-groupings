// import { describe, it, vi, beforeEach, expect } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import RemoveMemberModal from '@/components/modal/remove-member-modal';
//
// vi.mock('next/navigation', () => ({
//     useRouter: () => ({
//         refresh: vi.fn()
//     })
// }));
//
// describe('RemoveMemberModal', () => {
//     let mockAction: ReturnType<typeof vi.fn>;
//
//     beforeEach(() => {
//         mockAction = vi.fn();
//         vi.clearAllMocks();
//     });
//
//     it('should render and open the modal when trash icon is clicked', async () => {
//         const user = userEvent.setup();
//         render(
//             <RemoveMemberModal
//                 uid="test-uid"
//                 name="test-user"
//                 uhUuid="test-uhUuid"
//                 group="test-group"
//                 action={mockAction}
//             />
//         );
//
//         const trashIcon = screen.getByTestId('remove-member-icon');
//         expect(trashIcon).toBeInTheDocument();
//
//         await user.click(trashIcon);
//
//         expect(await screen.findByText('Remove Member')).toBeInTheDocument();
//         expect(screen.getAllByText('test-user')).toHaveLength(2);
//         expect(screen.getByText('test-uid')).toBeInTheDocument();
//         expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
//         expect(screen.getAllByText('test-group')).toHaveLength(2);
//     });
//
//     it('should call action and close modal when "Yes" is clicked', async () => {
//         const user = userEvent.setup();
//         render(
//             <RemoveMemberModal
//                 uid="test-uid"
//                 name="test-user"
//                 uhUuid="test-uhUuid"
//                 group="test-group"
//                 action={mockAction}
//             />
//         );
//
//         await user.click(screen.getByTestId('remove-member-icon'));
//         await user.click(await screen.findByRole('button', { name: 'Yes' }));
//
//         expect(mockAction).toHaveBeenCalledWith('test-uid');
//     });
//
//     it('should close modal when "Cancel" is clicked', async () => {
//         const user = userEvent.setup();
//         render(
//             <RemoveMemberModal
//                 uid="test-uid"
//                 name="test-user"
//                 uhUuid="test-uhUuid"
//                 group="test-group"
//                 action={mockAction}
//             />
//         );
//
//         await user.click(screen.getByTestId('remove-member-icon'));
//         const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
//
//         expect(cancelButton).toBeInTheDocument();
//         await user.click(cancelButton);
//
//         expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
//     });
// });

import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { removeIncludeMembers } from '@/lib/actions';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

vi.mock('@/lib/actions', () => ({
    removeIncludeMembers: vi.fn(() => Promise.resolve({ success: true }))
}));

describe('RemoveMemberModal', () => {
    let mockAction: ReturnType<typeof vi.fn>;
    let mockOnProcessing: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;
    let removeIncludeMembersMock: ReturnType<typeof vi.fn>;

    const testGroupingPath = 'test-grouping-path';

    beforeEach(() => {
        mockAction = vi.fn();
        mockOnProcessing = vi.fn();
        mockOnSuccess = vi.fn();
        mockOnClose = vi.fn();
        vi.clearAllMocks();
    });

    it('should render and open the modal when trash icon is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                isOpen={true}
                memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user,' }}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                onProcessing={mockOnProcessing}
                group="test-group"
                groupingPath={testGroupingPath}
            />
        );

        const trashIcon = screen.getByTestId('remove-member-icon');
        expect(trashIcon).toBeInTheDocument();

        await user.click(trashIcon);

        expect(await screen.findByText('Remove Member')).toBeInTheDocument();
        expect(screen.getAllByText('test-user')).toHaveLength(2);
        expect(screen.getByText('test-uid')).toBeInTheDocument();
        expect(screen.getByText('test-uhUuid')).toBeInTheDocument();
        expect(screen.getAllByText('test-group')).toHaveLength(2);
    });

    it('should process the remove member on click and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                isOpen={true}
                memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' }}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                onProcessing={mockOnProcessing}
                group="include"
                groupingPath={testGroupingPath}
            />
        );

        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockOnProcessing).toHaveBeenCalled();
        expect(removeIncludeMembers).toHaveBeenCalledWith(['test-uid', 'test-user', 'test-uhUuid'], testGroupingPath);
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
        // expect the modal is actually closed (expect remove member not to be in doc)
        // expect success modal
    });

    it('should close modal when "Cancel" is clicked', async () => {
        const user = userEvent.setup();
        render(
            <RemoveMemberModal
                isOpen={true}
                memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' }}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                onProcessing={mockOnProcessing}
                group="include"
                groupingPath={testGroupingPath}
            />
        );

        // await user.click(await screen.findByRole('button', { name: 'Cancel' }));
        const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();
        user.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();

        // await waitFor(() => {
        //     expect(screen.getByText('Remove Member')).not.toBeInTheDocument();
        // });
    });
});
