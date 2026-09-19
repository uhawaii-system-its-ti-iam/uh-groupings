import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, Mock } from 'vitest';
import MembershipsOptCell from '@/app/memberships/_components/memberships-table-opt-cell';
import { optIn, optOut } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const deferred = <T,>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
};

vi.mock('@/lib/actions', () => ({
    optIn: vi.fn(),
    optOut: vi.fn()
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn()
}));

describe('MembershipsOptCell', () => {
    it('should call optIn and refresh the router when opting in', async () => {
        const mockOptIn = vi.fn().mockResolvedValue(undefined);
        const mockRefresh = vi.fn();

        (optIn as Mock).mockImplementation(mockOptIn);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(<MembershipsOptCell isOptOut={false} optOutEnabled={true} groupingPath="test-group" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByRole('status')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockOptIn).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('should call optOut and refresh the router when opting out', async () => {
        const mockOptOut = vi.fn().mockResolvedValue(undefined);
        const mockRefresh = vi.fn();

        (optOut as Mock).mockImplementation(mockOptOut);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(<MembershipsOptCell isOptOut={true} optOutEnabled={true} groupingPath="test-group" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByRole('status')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockOptOut).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('should keep the spinner visible while the opt-in action is pending', async () => {
        const mockOptIn = vi.fn();
        const mockRefresh = vi.fn();
        const pendingAction = deferred<void>();

        mockOptIn.mockReturnValue(pendingAction.promise);
        (optIn as Mock).mockImplementation(mockOptIn);
        (useRouter as Mock).mockReturnValue({ refresh: mockRefresh });

        render(<MembershipsOptCell isOptOut={false} optOutEnabled={true} groupingPath="test-group" />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(mockRefresh).not.toHaveBeenCalled();

        pendingAction.resolve();

        await waitFor(() => {
            expect(mockOptIn).toHaveBeenCalledWith('test-group');
        });

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('should display "Required" text when optOutEnabled equal to false', () => {
        render(<MembershipsOptCell isOptOut={true} optOutEnabled={false} groupingPath="test-group" />);

        expect(screen.getByText('Required')).toBeInTheDocument();
    });
});
