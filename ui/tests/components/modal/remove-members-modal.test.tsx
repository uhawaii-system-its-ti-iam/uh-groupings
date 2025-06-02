import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import RemoveMembersModal from '@/components/modal/remove-members-modal';
import { removeIncludeMembers, removeExcludeMembers, removeOwners } from '@/lib/actions';

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
    let mockOnProcessing: ReturnType<typeof vi.fn>;
    let mockOnSuccess: ReturnType<typeof vi.fn>;
    let mockOnClose: ReturnType<typeof vi.fn>;

    const testGroupingPath = 'test-grouping-path';
    const testMembers = [
        {
            uid: 'testiwta',
            uhUuid: '99997010',
            name: 'Testf-iwt-a TestIAM-staff'
        },
        {
            uid: 'testiwtb',
            uhUuid: '99997027',
            name: 'Testf-iwt-b TestIAM-staff'
        },
        {
            uid: 'testiwtc',
            uhUuid: '99997033',
            name: 'Testf-iwt-c TestIAM-staff'
        }
    ];

    beforeEach(() => {
        mockOnProcessing = vi.fn();
        mockOnSuccess = vi.fn();
        mockOnClose = vi.fn();
        vi.clearAllMocks();
    });

    describe('Remove Include Members', () => {
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

        it('should render modal with correct members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.getByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('include list') ?? false;
            });
            expect(elements.length).toBeGreaterThan(0);

            expect(screen.getByText(testMembers[0].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[0].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uhUuid)).toBeInTheDocument();
        });

        it('should process the removeIncludeMembers on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();
            expect(removeIncludeMembers).toHaveBeenCalledWith(
                [testMembers[0].uhUuid, testMembers[1].uhUuid, testMembers[2].uhUuid],
                testGroupingPath
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Members')).not.toBeInTheDocument();
            });
        });
    });

    describe('Remove Exclude Members', () => {
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

        it('should render modal with correct members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.getByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('exclude list') ?? false;
            });
            expect(elements.length).toBeGreaterThan(0);

            expect(screen.getByText(testMembers[0].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[0].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uhUuid)).toBeInTheDocument();
        });

        it('should process the removeExcludeMembers on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();
            expect(removeExcludeMembers).toHaveBeenCalledWith(
                [testMembers[0].uhUuid, testMembers[1].uhUuid, testMembers[2].uhUuid],
                testGroupingPath
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Members')).not.toBeInTheDocument();
            });
        });
    });

    describe('Remove Owners', () => {
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

        it('should render modal with correct members and list info', async () => {
            render(<TestWrapper />);
            expect(screen.getByText('Remove Members')).toBeInTheDocument();
            const elements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('owners list') ?? false;
            });
            expect(elements.length).toBeGreaterThan(0);

            expect(screen.getByText(testMembers[0].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[0].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[1].uhUuid)).toBeInTheDocument();
            expect(screen.getByText(testMembers[2].uhUuid)).toBeInTheDocument();
        });

        it('should process the removeOwners on click and close modal when "Yes" is clicked', async () => {
            const user = userEvent.setup();
            render(<TestWrapper />);

            await user.click(await screen.findByRole('button', { name: 'Yes' }));

            expect(mockOnProcessing).toHaveBeenCalled();
            expect(removeOwners).toHaveBeenCalledWith(
                [testMembers[0].uhUuid, testMembers[1].uhUuid, testMembers[2].uhUuid],
                testGroupingPath
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.queryByText('Remove Members')).not.toBeInTheDocument();
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

        expect(screen.getByText('Remove Members')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => {
            expect(screen.queryByText('Remove Members')).not.toBeInTheDocument();
        });
    });
});
