import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MembershipsTable from '@/app/memberships/_components/memberships-table';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: vi.fn()
    })
}));

vi.mock('next-cas-client/app');

vi.spyOn(global.localStorage, 'getItem').mockReturnValue(JSON.stringify({ description: true, path: true }));

describe('MembershipsTable', () => {
    const mockResults = [
        {
            path: 'test-path1',
            name: 'test-name1',
            description: 'test-description1'
        },
        {
            path: 'test-path2',
            name: 'test-name2',
            description: 'test-description2'
        },
        {
            path: 'test-path3',
            name: 'test-name3',
            description: 'test-description3'
        }
    ];

    it('renders table with data', async () => {
        render(<MembershipsTable memberships={mockResults} isOptOut={false} />);

        await waitFor(() => {
            expect(screen.getByText('Available Memberships')).toBeInTheDocument();
        });
        expect(screen.getByText('test-name1')).toBeInTheDocument();
        expect(screen.getByText('test-name2')).toBeInTheDocument();
        expect(screen.getByText('test-name3')).toBeInTheDocument();
    });

    it('renders correct heading for opt-out', () => {
        render(<MembershipsTable memberships={mockResults} isOptOut={true} />);

        expect(screen.getByText('Manage Memberships')).toBeInTheDocument();
    });

    it('filters memberships based on search input', () => {
        render(<MembershipsTable memberships={mockResults} isOptOut={false} />);

        const input = screen.getByPlaceholderText('Filter Groupings...');
        fireEvent.change(input, { target: { value: 'test-name1' } });

        expect(screen.getByText('test-name1')).toBeInTheDocument();
        expect(screen.queryByText('test-name2')).not.toBeInTheDocument();
        expect(screen.queryByText('test-name3')).not.toBeInTheDocument();
    });

    it('triggers sorting when table header is clicked', async () => {
        render(<MembershipsTable memberships={mockResults} isOptOut={false} />);

        const header = screen.getByText('Description');
        fireEvent.click(header);

        const rows = screen.getAllByRole('row');
        const lastRow = rows[rows.length - 1];

        expect(screen.getByText('test-description1')).toBeInTheDocument();
        expect(screen.getByText('test-description2')).toBeInTheDocument();
        expect(lastRow).toHaveTextContent('test-description3');
    });

    it('should toggle the column settings', async () => {
        const previousColumnVisibility = window.localStorage.getItem('columnVisibility');
        window.localStorage.setItem('columnVisibility', JSON.stringify({ description: false, path: true }));

        try {
            render(<MembershipsTable memberships={mockResults} isOptOut={false} />);
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
            expect(screen.getByText('Grouping Path')).toBeInTheDocument();
        } finally {
            if (previousColumnVisibility === null) {
                window.localStorage.removeItem('columnVisibility');
            } else {
                window.localStorage.setItem('columnVisibility', previousColumnVisibility);
            }
            vi.restoreAllMocks();
        }
    });

    it('removes a row when the opt button is clicked', async () => {
        render(<MembershipsTable memberships={mockResults} isOptOut={false} />);

        const buttons = screen.getAllByTestId('opt-button');
        const button = buttons[0];
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText('test-name1')).not.toBeInTheDocument();
        });
        expect(screen.getByText('test-name2')).toBeInTheDocument();
        expect(screen.getByText('test-name3')).toBeInTheDocument();
    });
});
