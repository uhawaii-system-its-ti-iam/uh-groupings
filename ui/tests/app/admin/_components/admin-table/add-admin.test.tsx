import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddAdmin from '@/app/admin/_components/admin-table/table-element/add-admin';
import { memberAttributeResults } from '@/lib/actions';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import User from '@/lib/access/user';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

vi.mock('@/lib/actions', () => ({
    memberAttributeResults: vi.fn(),
    addAdmin: vi.fn()
}));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

const mockOnOptimisticAdd = vi.fn();

describe('AddAdmin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the input field and Add button', () => {
        render(
            <AddAdmin
                uids={['test-uid']}
                uhUuids={['test-uhUuid']}
                onOptimisticAdd={mockOnOptimisticAdd}
            />
        );
        expect(screen.getByPlaceholderText('UH Username or UH Number')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('displays validation error when input field is empty', async () => {
        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/You must enter a UH member to search/i)
            ).toBeInTheDocument();
        });
    });

    it('displays validation error when multiple entries are provided', async () => {
        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: 'test-uid-1, test-uid-2' }
        });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/You can only add one UH member at a time/i)
            ).toBeInTheDocument();
        });
    });

    it('displays error message when entered user is already an admin', async () => {
        render(
            <AddAdmin
                uids={[testUser.uid]}
                uhUuids={[testUser.uhUuid]}
                onOptimisticAdd={mockOnOptimisticAdd}
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

    it('displays error message when entered user cannot be found', async () => {
        (memberAttributeResults as ReturnType<typeof vi.fn>).mockResolvedValue({ results: [] });

        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

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

    it('displays the confirmation modal when a valid user is found', async () => {
        (memberAttributeResults as ReturnType<typeof vi.fn>).mockResolvedValue({
            results: [testUser.uid, testUser.uhUuid, testUser.name]
        });

        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByTestId('add-member-modal')).toBeInTheDocument();
        });
    });

    it('closes the confirmation modal when cancel action is triggered', async () => {
        (memberAttributeResults as ReturnType<typeof vi.fn>).mockResolvedValue({
            results: [testUser]
        });

        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

        fireEvent.change(screen.getByPlaceholderText(/UH Username/i), {
            target: { value: testUser.uid }
        });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await screen.findByTestId('add-member-modal');

        fireEvent.click(screen.getByTestId('modal-close-button'));
    });

    it('resets the input field after a user is successfully added as admin', async () => {
        (memberAttributeResults as ReturnType<typeof vi.fn>).mockResolvedValue({
            results: [testUser]
        });

        render(<AddAdmin uids={[]} uhUuids={[]} onOptimisticAdd={mockOnOptimisticAdd} />);

        const input = screen.getByPlaceholderText(/UH Username/i);

        fireEvent.change(input, { target: { value: testUser.uid } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await screen.findByTestId('add-member-modal');

        fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

        await waitFor(() => {
            expect((screen.getByPlaceholderText(/UH Username/i) as HTMLInputElement).value).toBe('');
        });
    });
});
