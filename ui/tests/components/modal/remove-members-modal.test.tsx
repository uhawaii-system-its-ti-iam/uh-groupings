import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import RemoveMembersModal from '@/components/modal/remove-members-modal';
import { removeIncludeMembers, removeExcludeMembers, removeOwners, removeAdmin } from '@/lib/actions';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

vi.mock('@/lib/actions', () => ({
    removeIncludeMembers: vi.fn(() => Promise.resolve({ success: true })),
    removeExcludeMembers: vi.fn(() => Promise.resolve({ success: true })),
    removeOwners: vi.fn(() => Promise.resolve({ success: true }))
}));

describe('RemoveMembersModal', () => {
    // let mockAction: ReturnType<typeof vi.fn>;
    let mockOnProcessing: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;

    const testGroupingPath = 'test-grouping-path';
    const testMembers = [
        { uid: 'test-uid-1', uhUuid: 'test-uhuuid-1', name: 'test-user-1' },
        { uid: 'test-uid-2', uhUuid: 'test-uhuuid-2', name: 'test-user-2' },
        { uid: 'test-uid-3', uhUuid: 'test-uhuuid-3', name: 'test-user-3' }
    ];

    beforeEach(() => {
        // mockAction = vi.fn();
        mockOnProcessing = vi.fn();
        mockOnSuccess = vi.fn();
        mockOnClose = vi.fn();
        vi.clearAllMocks();
    });

    describe('Remove Include Members', () => {
        // const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMembersModal
                    isOpen={isOpen}
                    membersToRemove={testMembers}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="include"
                    groupingPath={testGroupingPath}
                />
            );
        };

        it('should render modal with all members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('include list');
            });

            testMembers.forEach((member) => {
                expect(screen.getAllByText(member.name).length).toBeGreaterThan(0);
                expect(screen.getByText(member.uhUuid)).toBeInTheDocument();
                expect(screen.getByText(member.uid)).toBeInTheDocument();
            });
        });

        it('should process the removeIncludeMembers for all members on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();

            expect(removeIncludeMembers).toHaveBeenCalledWith(
                testMembers.map((member) => member.uhUuid),
                testGroupingPath
            );

            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
            });
        });
    });

    describe('Remove Exclude Members', () => {
        // const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMembersModal
                    isOpen={isOpen}
                    membersToRemove={testMembers}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="exclude"
                    groupingPath={testGroupingPath}
                />
            );
        };

        it('should render modal with all members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('exclude list');
            });

            testMembers.forEach((member) => {
                expect(screen.getAllByText(member.name).length).toBeGreaterThan(0);
                expect(screen.getByText(member.uhUuid)).toBeInTheDocument();
                expect(screen.getByText(member.uid)).toBeInTheDocument();
            });
        });

        it('should process the removeExcludeMembers for all members on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();

            expect(removeExcludeMembers).toHaveBeenCalledWith(
                testMembers.map((member) => member.uhUuid),
                testGroupingPath
            );

            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
            });
        });
    });
    describe('Remove Owners', () => {
        // const user = userEvent.setup();
        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            const handleClose = () => {
                setIsOpen(false);
                mockOnClose();
            };

            return (
                <RemoveMembersModal
                    isOpen={isOpen}
                    membersToRemove={testMembers}
                    onClose={handleClose}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="owners"
                    groupingPath={testGroupingPath}
                />
            );
        };

        it('should render modal with all members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('owners list');
            });

            testMembers.forEach((member) => {
                expect(screen.getAllByText(member.name).length).toBeGreaterThan(0);
                expect(screen.getByText(member.uhUuid)).toBeInTheDocument();
                expect(screen.getByText(member.uid)).toBeInTheDocument();
            });
        });

        it('should process the removeOwners for all members on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();

            expect(removeOwners).toHaveBeenCalledWith(
                testMembers.map((member) => member.uhUuid),
                testGroupingPath
            );

            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
            });
        });
    });

    it('should close modal when "Cancel" is clicked', async () => {
        const user = userEvent.setup();

        const TestWrapper = () => {
            const [isOpen, setIsOpen] = React.useState(true);

            return (
                <RemoveMembersModal
                    isOpen={isOpen}
                    membersToRemove={testMembers}
                    onClose={() => setIsOpen(false)}
                    onSuccess={mockOnSuccess}
                    onProcessing={mockOnProcessing}
                    group="include"
                    groupingPath={testGroupingPath}
                />
            );
        };

        render(<TestWrapper />);

        expect(screen.queryByText('Remove Members')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
            expect(screen.queryByText('Remove Members')).not.toBeInTheDocument();
        });
    });
});
