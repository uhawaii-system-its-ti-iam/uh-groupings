import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddAdmin from '@/app/admin/_components/admin-table/table-element/add-admin';
import { memberAttributeResults } from '@/lib/actions';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import User from '@/lib/access/user';

const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: mockRefresh
    })
}));

vi.mock('@/lib/actions', () => ({
    memberAttributeResults: vi.fn(),
}));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

const mockOnAddAdmin = vi.fn().mockResolvedValue(undefined);

describe('AddAdmin', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders input and add button', () => {
        render(
            <AddAdmin
                uids={['test-uid']}
                uhUuids={['test-uhUuid']}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        expect(
            screen.getByPlaceholderText('UH Username or UH Number')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: /add/i })
        ).toBeInTheDocument();
    });

    it('shows validation error when input empty', async () => {
        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/You must enter a UH member to search/i)
            ).toBeInTheDocument();
        });
    });

    it('shows validation error for multiple users', async () => {
        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: 'user1,user2' }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/You can only add one UH member at a time/i)
            ).toBeInTheDocument();
        });
    });

    it('shows error when user already admin', async () => {
        render(
            <AddAdmin
                uids={[testUser.uid]}
                uhUuids={[testUser.uhUuid]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(`${testUser.uid} is already an admin`)
            ).toBeInTheDocument();
        });
    });

    it('shows error when user not found', async () => {
        vi.mocked(memberAttributeResults).mockResolvedValue({
            results: []
        } as any);

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/No valid user data found/i)
            ).toBeInTheDocument();
        });
    });

    it('shows modal when user found', async () => {
        vi.mocked(memberAttributeResults).mockResolvedValue({
            results: [testUser]
        } as any);

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        expect(
            await screen.findByTestId('add-member-modal')
        ).toBeInTheDocument();
    });

    it('closes modal when cancel clicked', async () => {
        vi.mocked(memberAttributeResults).mockResolvedValue({
            results: [testUser]
        } as any);

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await screen.findByTestId('add-member-modal');

        fireEvent.click(screen.getByTestId('modal-close-button'));

        await waitFor(() => {
            expect(
                screen.queryByTestId('add-member-modal')
            ).not.toBeInTheDocument();
        });
    });

    it('adds admin successfully and resets input', async () => {
        vi.mocked(memberAttributeResults).mockResolvedValue({
            results: [testUser]
        } as any);

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        const input = screen.getByPlaceholderText(/UH Username/i);

        fireEvent.change(input, {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await screen.findByTestId('add-member-modal');

        fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

        await waitFor(() => {
            expect(mockOnAddAdmin).toHaveBeenCalledTimes(1);
        });

        expect((input as HTMLInputElement).value).toBe('');
    });

    it('shows error when search request fails', async () => {
        vi.mocked(memberAttributeResults).mockRejectedValue(
            new Error('network error')
        );

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to search user/i)
            ).toBeInTheDocument();
        });
    });

    it('shows error when add admin fails', async () => {
        vi.mocked(memberAttributeResults).mockResolvedValue({
            results: [testUser]
        } as any);

        mockOnAddAdmin.mockRejectedValueOnce(new Error('add failed'));

        render(
            <AddAdmin
                uids={[]}
                uhUuids={[]}
                onAddAdmin={mockOnAddAdmin}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await screen.findByTestId('add-member-modal');

        fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to add admin/i)
            ).toBeInTheDocument();
        });
    });

});