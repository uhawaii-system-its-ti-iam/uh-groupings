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




////////////////////////////////////
// jest test of admin-table.tsx
/////////////////////////////////////
//
//
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import AdminTable from '@/components/table/admin-table/admin-table';
// jest.mock('@/lib/fetchers');
//
// const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);
//
// const mockData = Array.from({ length: 200 }, (_, i) => ({
//     name: `name-example-${i}`,
//     uhUuid: `uhUuid-example-${i}`,
//     uid: `uid-example-${i}`,
//     firstName: `firstName-example-${i}`,
//     lastName: `lastName-example-${i}`
// }));
//
// describe('AdminTable', () => {
//     it('renders the table correctly', async () => {
//         render(<AdminTable members={mockData} />);
//         expect(screen.getByText('Manage Admins')).toBeInTheDocument();
//         expect(screen.getByPlaceholderText('Filter Admins...')).toBeInTheDocument();
//
//         // Check for table column headers
//         expect(screen.getByText('ADMIN NAME')).toBeInTheDocument();
//         expect(screen.getByText('UH NUMBER')).toBeInTheDocument();
//         expect(screen.getByText('UH USERNAME')).toBeInTheDocument();
//         expect(screen.getByText('REMOVE')).toBeInTheDocument();
//         expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
//         expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
//         expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
//
//
//         expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.length);
//
//         const firstPageAdmins = mockData.slice(0, pageSize);
//         firstPageAdmins.forEach((admin) => {
//             expect(screen.getByText(admin.name)).toBeInTheDocument();
//             expect(screen.getByText(admin.uhUuid)).toBeInTheDocument();
//             expect(screen.getByText(admin.uid)).toBeInTheDocument();
//         });
//
//         // Check for pagination (works)
//         expect(screen.getByText('First')).toBeInTheDocument();
//         expect(screen.getByText('Previous')).toBeInTheDocument();
//         expect(screen.getByText(1)).toBeInTheDocument();
//         expect(screen.getByText('Next')).toBeInTheDocument();
//         expect(screen.getByText('Last')).toBeInTheDocument();
//     });
//
//     it('filters data correctly using global filter', () => {
//         render(<AdminTable members={mockData} />);
//
//         const filterInput = screen.getByPlaceholderText('Filter Admins...');
//         fireEvent.change(filterInput, { target: { value: mockData[1].name } });
//
//
//         expect(screen.getByText(mockData[1].name)).toBeInTheDocument();
//         expect(screen.queryByText(mockData[0].name)).not.toBeInTheDocument();
//
//         fireEvent.change(filterInput, { target: { value: mockData[0].name } });
//         expect(screen.getByText(mockData[0].name)).toBeInTheDocument();
//         expect(screen.queryByText(mockData[1].name)).not.toBeInTheDocument();
//     });
//
//     it('sorts data when header is clicked', async () => {
//         const clickAndWaitForSorting = async (headerText: string, expectedOrder: string[], isAscending = true) => {
//             fireEvent.click(screen.getByText(headerText));
//             await waitFor(() => {
//                 const chevronIcon = screen.getByTestId(isAscending ?  'chevron-down-icon' : 'chevron-up-icon' );
//                 expect(chevronIcon).toBeInTheDocument();
//             });
//             const rows = screen.getAllByRole('row');
//             expectedOrder.forEach((item, index) => {
//                 expect(rows[index + 1]).toHaveTextContent(item);
//             });
//         };
//
//         render(<AdminTable members={mockData} />);
//
//
//         // Sort by admin name - Ascending order
//         await clickAndWaitForSorting('ADMIN NAME', [mockData[0].name, mockData[1].name], true);
//         // Sort by admin name - Descending order
//         await clickAndWaitForSorting(
//             'ADMIN NAME',
//             [mockData[mockData.length - 1].name, mockData[mockData.length - 2].name],
//             false
//         );
//
//         // Sort by UH NUMBER - Ascending order
//         await clickAndWaitForSorting('UH NUMBER', [mockData[0].uhUuid, mockData[1].uhUuid], true);
//
//         // Sort by UH NUMBER - Descending order
//         await clickAndWaitForSorting(
//             'UH NUMBER',
//             [mockData[mockData.length - 1].uhUuid, mockData[mockData.length - 2].uhUuid],
//             false
//         );
//
//         //  Sort by UH USERNAME - Ascending order
//         await clickAndWaitForSorting('UH USERNAME', [mockData[0].uid, mockData[1].uid], true);
//         //  Sort by UH USERNAME - Descending order
//         await clickAndWaitForSorting(
//             'UH USERNAME',
//             [mockData[mockData.length - 1].uid, mockData[mockData.length - 2].uid],
//             false
//         );
//
//     }, 10000);
//
//     it('should paginate correctly', async () => {
//         render(<AdminTable members={mockData} />);
//
//         const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
//             fireEvent.click(screen.getByText(buttonText));
//             const rows = screen.getAllByRole('row');
//             expect(rows.length).toBe(pageSize + 1); // +1 for header row
//             expect(screen.getByText(`name-example-${expectedRowStart}`)).toBeInTheDocument();
//             expect(screen.getByText(`name-example-${expectedRowEnd}`)).toBeInTheDocument();
//         };
//         await checkPageContent('First', 0, pageSize - 1);
//         await checkPageContent('Next', pageSize, pageSize * 2 - 1);
//         await checkPageContent('Last', mockData.length - pageSize, mockData.length - 1);
//         await checkPageContent('Previous', mockData.length - pageSize * 2, mockData.length - pageSize - 1);
//     });
// });
