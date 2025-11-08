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
import React from 'react';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { removeIncludeMembers, removeExcludeMembers, removeOwners, removeAdmin } from '@/lib/actions';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

vi.mock('@/lib/actions', () => ({
    removeIncludeMembers: vi.fn(() => Promise.resolve({ success: true })),
    removeExcludeMembers: vi.fn(() => Promise.resolve({ success: true })),
    removeOwners: vi.fn(() => Promise.resolve({ success: true })),
    removeAdmin: vi.fn(() => Promise.resolve({ success: true }))
}));

describe('RemoveMemberModal', () => {
    let mockAction: ReturnType<typeof vi.fn>;
    let mockOnProcessing: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;
    // let removeIncludeMembersMock: ReturnType<typeof vi.fn>;
    // let removeExcludeMembersMock: ReturnType<typeof vi.fn>;
    // let removeOwnersMock: ReturnType<typeof vi.fn>;
    // let removeAdminMock: ReturnType<typeof vi.fn>;

    const testGroupingPath = 'test-grouping-path';
    const testMember = { uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' };

    beforeEach(() => {
        mockAction = vi.fn();
        mockOnProcessing = vi.fn();
        mockOnSuccess = vi.fn();
        mockOnClose = vi.fn();
        vi.clearAllMocks();
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

    // it('should close modal when "Cancel" is clicked', async () => {
    //     const user = userEvent.setup();
    //     render(
    //         <RemoveMemberModal
    //             isOpen={true}
    //             memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' }}
    //             onClose={mockOnClose}
    //             onSuccess={mockOnSuccess}
    //             onProcessing={mockOnProcessing}
    //             group="include"
    //             groupingPath={testGroupingPath}
    //         />
    //     );
    //
    //     // await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    //     const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
    //     expect(cancelButton).toBeInTheDocument();
    //     user.click(cancelButton);
    //
    //     expect(mockOnClose).toHaveBeenCalled();
    //
    //     // await waitFor(() => {
    //     //     expect(screen.getByText('Remove Member')).not.toBeInTheDocument();
    //     // });
    // });
    // it('should close modal when "Cancel" is clicked', async () => {
    //     const user = userEvent.setup();
    //     const { rerender } = render(
    //         <RemoveMemberModal
    //             isOpen={true}
    //             memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' }}
    //             onClose={mockOnClose}
    //             onSuccess={mockOnSuccess}
    //             onProcessing={mockOnProcessing}
    //             group="include"
    //             groupingPath={testGroupingPath}
    //         />
    //     );
    //
    //     // await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    //     const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    //     await user.click(cancelButton);
    //
    //     expect(mockOnClose).toHaveBeenCalled();
    //
    //     rerender(
    //         <RemoveMemberModal
    //             isOpen={false}
    //             memberToRemove={{ uid: 'test-uid', uhUuid: 'test-uhUuid', name: 'test-user' }}
    //             onClose={mockOnClose}
    //             onSuccess={mockOnSuccess}
    //             onProcessing={mockOnProcessing}
    //             group="include"
    //             groupingPath={testGroupingPath}
    //         />
    //     );
    //
    //     expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
    // });
    it('should process the removeIncludeMembers on click and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMemberModal
                    isOpen={isOpen}
                    memberToRemove={testMember}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="include"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Member')).toBeInTheDocument();

        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        // check that it says include in modal

        expect(mockOnProcessing).toHaveBeenCalled();
        expect(removeIncludeMembers).toHaveBeenCalledWith(
            [testMember.uid, testMember.name, testMember.uhUuid],
            testGroupingPath
        );
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        });
    });

    it('should process the removeExcludeMembers on click and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMemberModal
                    isOpen={isOpen}
                    memberToRemove={testMember}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="exclude"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Member')).toBeInTheDocument();

        // check that it says exclude in modal

        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockOnProcessing).toHaveBeenCalled();
        expect(removeExcludeMembers).toHaveBeenCalledWith(
            [testMember.uid, testMember.name, testMember.uhUuid],
            testGroupingPath
        );
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        });
    });

    it('should process the removeOwners on click and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMemberModal
                    isOpen={isOpen}
                    memberToRemove={testMember}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="owners"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Member')).toBeInTheDocument();

        // expect owners text in modal

        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockOnProcessing).toHaveBeenCalled();
        expect(removeOwners).toHaveBeenCalledWith(
            [testMember.uid, testMember.name, testMember.uhUuid],
            testGroupingPath
        );
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        });
    });

    it('should process the removeAdmin on click and close modal when "Yes" is clicked', async () => {
        const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMemberModal
                    isOpen={isOpen}
                    memberToRemove={testMember}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="admins"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Member')).toBeInTheDocument();

        // expect admin text is in modal

        await user.click(await screen.findByRole('button', { name: 'Yes' }));

        expect(mockOnProcessing).toHaveBeenCalled();
        expect(removeAdmin).toHaveBeenCalledWith(
            [testMember.uid, testMember.name, testMember.uhUuid],
            testGroupingPath
        );
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        });
    });

    it('should close modal when "Cancel" is clicked', async () => {
        const user = userEvent.setup();

        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            return (
                <RemoveMemberModal
                    isOpen={isOpen}
                    memberToRemove={testMember}
                    onClose={() => setIsOpen(false)}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="include"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Member')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
            expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
        });
    });
});
