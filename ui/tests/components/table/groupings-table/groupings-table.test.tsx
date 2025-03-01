import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';
import userEvent from '@testing-library/user-event';

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
        const user = userEvent.setup();

        // Open column settings
        await waitFor(
            async () => {
                await user.click(screen.getByLabelText('column-settings-button'));
            },
            { timeout: 2000 }
        );

        // Toggle Grouping Path Switch to true
        const groupingPathSwitch = await screen.findByTestId('Grouping Path Switch');
        await waitFor(async () => {
            await user.click(groupingPathSwitch);
        });

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

        //  Sort by grouping path - Ascending order
        await clickAndWaitForSorting('Grouping Path', [mockGroupingPaths[0].name, mockGroupingPaths[1].name], true);

        //  Sort by grouping path - Descending order
        await clickAndWaitForSorting(
            'Grouping Path',
            [
                mockGroupingPaths[mockGroupingPaths.length - 1].name,
                mockGroupingPaths[mockGroupingPaths.length - 2].name
            ],
            false
        );
    }, 10000);

    it('should toggle the column settings correctly', async () => {
        render(<GroupingsTable groupingPaths={mockGroupingPaths} />);
        const button = screen.getByLabelText('column-settings-button');
        const user = userEvent.setup();

        const toggleColumnVisibility = async (columnTestId: string, isVisible: boolean) => {
            await waitFor(
                async () => {
                    await user.click(button);
                },
                { timeout: 2000 }
            );
            fireEvent.click(screen.getByTestId(columnTestId));

            // Check getByText('Description') or getByText('Grouping Path') to be in document
            if (isVisible) {
                expect(screen.getByText(columnTestId.replace(' Switch', ''))).toBeInTheDocument();
            } else {
                expect(screen.queryByText(columnTestId.replace(' Switch', ''))).not.toBeInTheDocument();
            }
        };
        // Toggle description column
        await toggleColumnVisibility('Description Switch', false);
        await toggleColumnVisibility('Description Switch', true);

        // Toggle grouping path column
        await toggleColumnVisibility('Grouping Path Switch', false);
        await toggleColumnVisibility('Grouping Path Switch', true);
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
});
