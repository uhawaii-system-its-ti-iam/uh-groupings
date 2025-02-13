import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, Mock } from 'vitest';
import MembershipsOptOutCell from '@/app/memberships/_components/memberships-optout-cell';
import { optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';

vi.mock('@/lib/actions', () => ({
    optOut: vi.fn()
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

describe('MembershipsOptOutCell', () => {
    it('should call optOut and refresh the router on button click', async () => {
        const mockOptOut = vi.fn();
        const mockRefresh = vi.fn();

        (optOut as Mock).mockImplementation(mockOptOut);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(<MembershipsOptOutCell optOutEnabled={true} groupingPath="test-group" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOptOut).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
    });
});
