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
    let mockOnProcessing: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;

    const testGroupingPath = 'test-grouping-path';
    const testMember = { uid: 'testiwta', uhUuid: '99997010', name: 'Testf-iwt-a TestIAM-staff' };

    beforeEach(() => {
        mockOnProcessing = vi.fn();
        mockOnSuccess = vi.fn();
        mockOnClose = vi.fn();
        vi.clearAllMocks();
    });

    describe('Remove Include Member', () => {
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

        it('should render modal with correct member and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Member')).toBeInTheDocument();
            screen.getAllByText((content, element) => {
                return element?.textContent?.includes('include list') ?? false;
            });

            expect(screen.getAllByText(testMember.name).length).toBeGreaterThan(0);
            expect(screen.getByText(testMember.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMember.uid)).toBeInTheDocument();
        });

        it('should process the removeIncludeMembers on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

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
    });

    describe('Remove Exclude Member', () => {
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

        it('should render modal with correct member and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Member')).toBeInTheDocument();
            screen.getAllByText((content, element) => {
                return element?.textContent?.includes('exclude list') ?? false;
            });

            expect(screen.getAllByText(testMember.name).length).toBeGreaterThan(0);
            expect(screen.getByText(testMember.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMember.uid)).toBeInTheDocument();
        });

        it('should process the removeExcludeMembers on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

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
    });

    describe('Remove Owner', () => {
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

        it('should render modal with correct member and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Member')).toBeInTheDocument();
            screen.getAllByText((content, element) => {
                return element?.textContent?.includes('owners list') ?? false;
            });

            expect(screen.getAllByText(testMember.name).length).toBeGreaterThan(0);
            expect(screen.getByText(testMember.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMember.uid)).toBeInTheDocument();
        });

        it('should process the removeOwners on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();
            expect(removeOwners).toHaveBeenCalledWith([testMember.uhUuid], testGroupingPath);
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Member')).not.toBeInTheDocument();
            });
        });
    });

    describe('Remove Admin', () => {
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

        it('should render modal with correct member and list info', async () => {
            render(<TestWrapper />);
            expect(screen.queryByText('Remove Member')).toBeInTheDocument();
            screen.getAllByText((content, element) => {
                return element?.textContent?.includes('admins') ?? false;
            });

            expect(screen.getAllByText(testMember.name).length).toBeGreaterThan(0);
            expect(screen.getByText(testMember.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMember.uid)).toBeInTheDocument();
        });

        it('should process the removeAdmin on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();
            expect(removeAdmin).toHaveBeenCalledWith(testMember.uid);
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
