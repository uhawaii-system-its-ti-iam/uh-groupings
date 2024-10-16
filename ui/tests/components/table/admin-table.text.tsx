import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminTable from '@/components/table/adminTable/admin-table';
import userEvent from '@testing-library/user-event';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockData = Array.from({ length: 200 }, (_, i) => ({
    name: `example-${i}`,
    uhUuid: `example-${i}`,
    uid: `example-${i}`
}));

describe('AdminTable', () => {
    it('renders the table correctly', async () => {
        render(<AdminTable members={mockData} />);

        // Check for "Manage Groupings", filter, and column settings
        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Filter Groupings...')).toBeInTheDocument();
        expect(screen.getByLabelText('column-settings-button')).toBeInTheDocument();

        // Check for table column headers
        expect(screen.getByText('Grouping Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.length);

        const firstPageGroupings = mockData.slice(0, pageSize);
        firstPageGroupings.forEach((group) => {
            expect(screen.getAllByTestId('square-pen-icon')[0]).toBeInTheDocument();
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

    it('filters data correctly using global filter', () => {
        render(<AdminTable members={mockData} />);

        const filterInput = screen.getByPlaceholderText('Filter Groupings...');
        fireEvent.change(filterInput, { target: { value: mockData[1].name } });

        expect(screen.getByText(mockData[1].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData[0].name)).not.toBeInTheDocument();

        fireEvent.change(filterInput, { target: { value: mockData[0].name } });
        expect(screen.getByText(mockData[0].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData[1].name)).not.toBeInTheDocument();
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

        render(<AdminTable members={mockData} />);
        const user = userEvent.setup();

        // Open column settings
        await waitFor(async () => {
            await user.click(screen.getByLabelText('column-settings-button'));
        });

        // Toggle Grouping Path Switch to true
        const groupingPathSwitch = await screen.findByTestId('Grouping Path Switch');
        await waitFor(async () => {
            await user.click(groupingPathSwitch);
        });

        // Sort by grouping name - Descending order
        await clickAndWaitForSorting(
            'Grouping Name',
            [mockData[mockData.length - 1].name, mockData[mockData.length - 2].name],
            false
        );

        // Sort by grouping name - Ascending order
        await clickAndWaitForSorting('Grouping Name', [mockData[0].name, mockData[1].name], true);

        // Sort by description - Ascending order
        await clickAndWaitForSorting('Description', [mockData[0].description, mockData[1].description], true);

        // Sort by description - Descending order
        await clickAndWaitForSorting(
            'Description',
            [mockData[mockData.length - 1].description, mockData[mockData.length - 2].description],
            false
        );

        //  Sort by grouping path - Ascending order
        await clickAndWaitForSorting('Grouping Path', [mockData[0].name, mockData[1].name], true);

        //  Sort by grouping path - Descending order
        await clickAndWaitForSorting(
            'Grouping Path',
            [mockData[mockData.length - 1].name, mockData[mockData.length - 2].name],
            false
        );
    }, 10000);

    it('should paginate correctly', async () => {
        render(<AdminTable members={mockData} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', mockData.length - pageSize, mockData.length - 1);
        await checkPageContent('Previous', mockData.length - pageSize * 2, mockData.length - pageSize - 1);
    });
});
