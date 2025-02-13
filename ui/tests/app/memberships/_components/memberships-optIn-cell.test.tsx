import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, Mock } from 'vitest';
import MembershipsOptInCell from '@/app/memberships/_components/memberships-optIn-cell';
import { optIn } from '@/lib/actions';
import { useRouter } from 'next/navigation';

vi.mock('@/lib/actions', () => ({
    optIn: vi.fn()
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

describe('MembershipsOptInCell', () => {
    it('should call optIn and refresh the router on button click', async () => {
        const mockOptIn = vi.fn();
        const mockRefresh = vi.fn();

        (optIn as Mock).mockImplementation(mockOptIn);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(<MembershipsOptInCell groupingPath="test-group" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOptIn).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
    });
});
