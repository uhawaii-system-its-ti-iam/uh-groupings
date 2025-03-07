import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MembershipsTable from '@/app/memberships/_components/memberships-table';
import userEvent from '@testing-library/user-event';

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
        render(<MembershipsTable memberships={mockResults} isOptOut={false} />);

        const button = screen.getByLabelText('column-settings-button');
        const user = userEvent.setup();

        const toggleColumnVisibility = async (columnTestId: string, isVisible: boolean) => {
            await waitFor(
                async () => {
                    await user.click(button);
                },
                { timeout: 8000 }
            );

            fireEvent.click(screen.getByTestId(columnTestId));

            if (isVisible) {
                expect(screen.getByText(columnTestId.replace(' Switch', ''))).toBeInTheDocument();
            } else {
                expect(screen.queryByText(columnTestId.replace(' Switch', ''))).not.toBeInTheDocument();
            }
        };

        await toggleColumnVisibility('Description Switch', false);
        await toggleColumnVisibility('Description Switch', true);

        await toggleColumnVisibility('Grouping Path Switch', true);
        await toggleColumnVisibility('Grouping Path Switch', false);

        vi.restoreAllMocks();
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
