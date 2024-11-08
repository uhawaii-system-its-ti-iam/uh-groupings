import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminTable from '@/components/table/admin-table/admin-table';
jest.mock('@/lib/fetchers');
// import userEvent from '@testing-library/user-event';


const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockData = Array.from({ length: 200 }, (_, i) => ({
    name: `name-example-${i}`,
    uhUuid: `uhUuid-example-${i}`,
    uid: `uid-example-${i}`,
    firstName: `firstName-example-${i}`,
    lastName: `lastName-example-${i}`
}));

describe('AdminTable', () => {
    it('renders the table correctly', async () => {
        render(<AdminTable members={mockData} />);


        // Check for "Manage Admins", filter
        expect(screen.getByText('Manage Admins')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Filter Admins...')).toBeInTheDocument();

        // Check for table column headers
        expect(screen.getByText('ADMIN NAME')).toBeInTheDocument();
        expect(screen.getByText('UH NUMBER')).toBeInTheDocument();
        expect(screen.getByText('UH USERNAME')).toBeInTheDocument();
        expect(screen.getByText('REMOVE')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();


        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.length);

        const firstPageAdmins = mockData.slice(0, pageSize);
        firstPageAdmins.forEach((admin) => {
            expect(screen.getByText(admin.name)).toBeInTheDocument();
            expect(screen.getByText(admin.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(admin.uid)).toBeInTheDocument();
        });

        // Check for pagination (works)
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<AdminTable members={mockData} />);

        const filterInput = screen.getByPlaceholderText('Filter Admins...');
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
                const chevronIcon = screen.getByTestId(isAscending ?  'chevron-down-icon' : 'chevron-up-icon' );
                expect(chevronIcon).toBeInTheDocument();
            });
            const rows = screen.getAllByRole('row');
            expectedOrder.forEach((item, index) => {
                expect(rows[index + 1]).toHaveTextContent(item);
            });
        };

        render(<AdminTable members={mockData} />);


        // Sort by admin name - Ascending order
        await clickAndWaitForSorting('ADMIN NAME', [mockData[0].name, mockData[1].name], true);
        // Sort by admin name - Descending order
        await clickAndWaitForSorting(
            'ADMIN NAME',
            [mockData[mockData.length - 1].name, mockData[mockData.length - 2].name],
            false
        );

        // Sort by UH NUMBER - Ascending order
        await clickAndWaitForSorting('UH NUMBER', [mockData[0].uhUuid, mockData[1].uhUuid], true);

        // Sort by UH NUMBER - Descending order
        await clickAndWaitForSorting(
            'UH NUMBER',
            [mockData[mockData.length - 1].uhUuid, mockData[mockData.length - 2].uhUuid],
            false
        );

        //  Sort by UH USERNAME - Ascending order
        await clickAndWaitForSorting('UH USERNAME', [mockData[0].uid, mockData[1].uid], true);
        //  Sort by UH USERNAME - Descending order
        await clickAndWaitForSorting(
            'UH USERNAME',
            [mockData[mockData.length - 1].uid, mockData[mockData.length - 2].uid],
            false
        );

    }, 10000);

    it('should paginate correctly', async () => {
        render(<AdminTable members={mockData} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`name-example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`name-example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', mockData.length - pageSize, mockData.length - 1);
        await checkPageContent('Previous', mockData.length - pageSize * 2, mockData.length - pageSize - 1);
    });
});
