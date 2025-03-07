import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, Mock } from 'vitest';
import MembershipsOptCell from '@/app/memberships/_components/memberships-table-opt-cell';
import { optIn, optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';

vi.mock('@/lib/actions', () => ({
    optIn: vi.fn(),
    optOut: vi.fn()
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

describe('MembershipsOptCell', () => {
    it('should call optIn and refresh the router when opting in', async () => {
        const mockOptIn = vi.fn();
        const mockRefresh = vi.fn();
        const mockRemoveRow = vi.fn();

        (optIn as Mock).mockImplementation(mockOptIn);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(
            <MembershipsOptCell
                isOptOut={false}
                optOutEnabled={true}
                groupingPath="test-group"
                removeRow={mockRemoveRow}
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRemoveRow).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockOptIn).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it('should call optOut and refresh the router when opting out', async () => {
        const mockOptOut = vi.fn();
        const mockRefresh = vi.fn();
        const mockRemoveRow = vi.fn();

        (optOut as Mock).mockImplementation(mockOptOut);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(
            <MembershipsOptCell
                isOptOut={true}
                optOutEnabled={true}
                groupingPath="test-group"
                removeRow={mockRemoveRow}
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRemoveRow).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockOptOut).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it('should display "Required" text when optOutEnabled equal to false', () => {
        render(
            <MembershipsOptCell isOptOut={true} optOutEnabled={false} groupingPath="test-group" removeRow={vi.fn()} />
        );

        expect(screen.getByText('Required')).toBeInTheDocument();
    });
});
