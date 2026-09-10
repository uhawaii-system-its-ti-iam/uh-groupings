import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockGroupingPaths = Array.from({ length: 200 }, (_, i) => ({
    path: `tmp:example:example-${i}`,
    name: `example-${i}`,
    description: `Test Description ${i}`
}));

describe('GroupingsTable', () => {
    it('renders the table correctly', async () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);

        // Check for "Manage Groupings", filter, and column settings
        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Filter Groupings...')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('column-settings-button')).toBeInTheDocument();

        // Check for table column headers
        expect(screen.getByText('Grouping Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockGroupingPaths.length);

        const firstPageGroupings = mockGroupingPaths.slice(0, pageSize);
        firstPageGroupings.forEach((group) => {
            expect(screen.getAllByTestId('edit-icon')[0]).toBeInTheDocument();
            expect(screen.getByText(group.name)).toBeInTheDocument();
            expect(screen.getByText(group.description)).toBeInTheDocument();
            expect(screen.queryByDisplayValue(group.path)).not.toBeInTheDocument();
        });

        // Check for pagination
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('renders the correct link for manage grouping', () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);
        const firstPageGroupings = mockGroupingPaths.slice(0, pageSize);
        firstPageGroupings.forEach((group) => {
            const linkElement = screen.getByRole('link', { name: group.name });
            expect(linkElement).toHaveAttribute('href', `/groupings/${group.path}/all-members`);
        });
    });

    it('marks grouping links rendered in Admin', () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} fromAdmin />);

        const firstGrouping = mockGroupingPaths[0];
        expect(screen.getByRole('link', { name: firstGrouping.name })).toHaveAttribute(
            'href',
            `/groupings/${firstGrouping.path}/all-members?from=admin`
        );
    });

    it('filters data correctly using global filter', () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);

        const filterInput = screen.getByPlaceholderText('Filter Groupings...');
        fireEvent.change(filterInput, { target: { value: mockGroupingPaths[1].name } });

        expect(screen.getByText(mockGroupingPaths[1].name)).toBeInTheDocument();
        expect(screen.queryByText(mockGroupingPaths[0].name)).not.toBeInTheDocument();

        fireEvent.change(filterInput, { target: { value: mockGroupingPaths[0].name } });
        expect(screen.getByText(mockGroupingPaths[0].name)).toBeInTheDocument();
        expect(screen.queryByText(mockGroupingPaths[1].name)).not.toBeInTheDocument();
    });

    it('sorts data when header is clicked', async () => {
        const clickAndWaitForSorting = async (headerText: string, expectedOrder: string[], isAscending = true) => {
            fireEvent.click(screen.getByText(headerText));
            await waitFor(() => {
                const chevronIcon = screen.getByTestId(isAscending ? 'chevron-down-icon' : 'chevron-up-icon');
                expect(chevronIcon).toBeInTheDocument();
            });
            const rows = screen.getAllByRole('row');
            expectedOrder.forEach((item, index) => {
                expect(rows[index + 1]).toHaveTextContent(item);
            });
        };

        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);

        // Sort by grouping name - Descending order
        await clickAndWaitForSorting(
            'Grouping Name',
            [
                mockGroupingPaths[mockGroupingPaths.length - 1].name,
                mockGroupingPaths[mockGroupingPaths.length - 2].name
            ],
            false
        );

        // Sort by grouping name - Ascending order
        await clickAndWaitForSorting('Grouping Name', [mockGroupingPaths[0].name, mockGroupingPaths[1].name], true);

        // Sort by description - Ascending order
        await clickAndWaitForSorting(
            'Description',
            [mockGroupingPaths[0].description, mockGroupingPaths[1].description],
            true
        );

        // Sort by description - Descending order
        await clickAndWaitForSorting(
            'Description',
            [
                mockGroupingPaths[mockGroupingPaths.length - 1].description,
                mockGroupingPaths[mockGroupingPaths.length - 2].description
            ],
            false
        );
    }, 10000);

    it('should toggle the column settings correctly', async () => {
        const previousColumnVisibility = window.localStorage.getItem('columnVisibility');
        window.localStorage.setItem('columnVisibility', JSON.stringify({ description: false, path: true }));

        try {
            render(<GroupingsTable groupingPaths={mockGroupingPaths} />);
            expect(screen.queryByText('Description')).not.toBeInTheDocument();
            expect(screen.getByText('Grouping Path')).toBeInTheDocument();
        } finally {
            if (previousColumnVisibility === null) {
                window.localStorage.removeItem('columnVisibility');
            } else {
                window.localStorage.setItem('columnVisibility', previousColumnVisibility);
            }
        }
    });

    it('should paginate correctly', async () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', mockGroupingPaths.length - pageSize, mockGroupingPaths.length - 1);
        await checkPageContent(
            'Previous',
            mockGroupingPaths.length - pageSize * 2,
            mockGroupingPaths.length - pageSize - 1
        );
    });

    it('filters groupings using only the displayed columns', async () => {
        const grouping = {
            path: 'tmp:path-only-match',
            name: 'Visible Grouping Name',
            description: 'Description-only match'
        };
        const previousColumnVisibility = window.localStorage.getItem('columnVisibility');

        window.localStorage.setItem('columnVisibility', JSON.stringify({ description: true, path: false }));

        try {
            const { unmount } = render(<GroupingsTable groupingPaths={[grouping]} />);

            const filterInput = await screen.findByPlaceholderText('Filter Groupings...');
            fireEvent.change(filterInput, { target: { value: 'path-only-match' } });
            expect(screen.queryByText(grouping.name)).not.toBeInTheDocument();

            window.localStorage.setItem('columnVisibility', JSON.stringify({ description: true, path: true }));
            unmount();
            const secondRender = render(<GroupingsTable groupingPaths={[grouping]} />);
            fireEvent.change(await screen.findByPlaceholderText('Filter Groupings...'), {
                target: { value: 'path-only-match' }
            });
            expect(screen.getByText(grouping.name)).toBeInTheDocument();

            fireEvent.change(await screen.findByPlaceholderText('Filter Groupings...'), {
                target: { value: 'description-only' }
            });
            expect(screen.getByText(grouping.name)).toBeInTheDocument();

            window.localStorage.setItem('columnVisibility', JSON.stringify({ description: false, path: true }));
            secondRender.unmount();
            render(<GroupingsTable groupingPaths={[grouping]} />);
            fireEvent.change(await screen.findByPlaceholderText('Filter Groupings...'), {
                target: { value: 'description-only' }
            });
            expect(screen.queryByText(grouping.name)).not.toBeInTheDocument();
        } finally {
            if (previousColumnVisibility === null) {
                window.localStorage.removeItem('columnVisibility');
            } else {
                window.localStorage.setItem('columnVisibility', previousColumnVisibility);
            }
        }
    });

    it('filters only by grouping name below the sm breakpoint', async () => {
        const grouping = {
            path: 'tmp:path-only-match',
            name: 'Visible Grouping Name',
            description: 'Description-only match'
        };
        const previousInnerWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 575 });

        try {
            render(<GroupingsTable groupingPaths={[grouping]} />);

            const filterInput = await screen.findByPlaceholderText('Filter Groupings...');

            fireEvent.change(filterInput, { target: { value: 'description-only' } });
            expect(screen.queryByText(grouping.name)).not.toBeInTheDocument();

            fireEvent.change(filterInput, { target: { value: 'path-only-match' } });
            expect(screen.queryByText(grouping.name)).not.toBeInTheDocument();

            fireEvent.change(filterInput, { target: { value: grouping.name } });
            expect(screen.getByText(grouping.name)).toBeInTheDocument();
        } finally {
            Object.defineProperty(window, 'innerWidth', { configurable: true, value: previousInnerWidth });
        }
    });
});
