import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminTable from '@/components/table/admin-table/admin-table';
import userEvent from '@testing-library/user-event';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const mockMembers = Array.from({ length: 200 }, (_, i) => ({
    name: `name-example-${i}`,
    uhUuid: `uhUuid-example-${i}`,
    uid: `uid-example-${i}`,
    firstName: `firstName-example-${i}`,
    lastName: `lastName-example-${i}`
}));

const mockData = {
    members: mockMembers
}

describe('AdminTable', () => {
    it('renders the table correctly', async () => {
        render(<AdminTable groupingGroupMembers={mockData} />);

        // Check for "Manage Admin", filter, and column settings
        expect(screen.getByText('Manage Admins')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Filter Admins...')).toBeInTheDocument();
        }, );

        // Check for table column headers
        expect(screen.getByText('Admin Name')).toBeInTheDocument();
        expect(screen.getByText('UH Number')).toBeInTheDocument();
        expect(screen.queryByText('UH Username')).toBeInTheDocument();

        // expect(screen.getByTestId('Remove')).toBeInTheDocument();
        expect(screen.queryByText('Grouping Path')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(mockData.members.length);

        const firstPageAdmins = mockData.members.slice(0, pageSize);
        firstPageAdmins.forEach((admin) => {
            expect(screen.getByText(admin.name)).toBeInTheDocument();
            expect(screen.getByText(admin.uhUuid)).toBeInTheDocument();
            expect(screen.getByText(admin.uid)).toBeInTheDocument();
        });

        // Check for pagination
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<AdminTable groupingGroupMembers={mockData} />);

        const filterInput = screen.getByPlaceholderText('Filter Admins...');
        fireEvent.change(filterInput, { target: { value: mockData.members[1].name } });

        expect(screen.getByText(mockData.members[1].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData.members[0].name)).not.toBeInTheDocument();

        fireEvent.change(filterInput, { target: { value: mockData.members[0].name } });
        expect(screen.getByText(mockData.members[0].name)).toBeInTheDocument();
        expect(screen.queryByText(mockData.members[1].name)).not.toBeInTheDocument();
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

        render(<AdminTable groupingGroupMembers={mockData} />);
        const user = userEvent.setup();

        // Open column settings
        // await waitFor(
        //     async () => {
        //         await user.click(screen.getByLabelText('column-settings-button'));
        //     },
        //     { timeout: 2000 }
        // );

        // Toggle Admin Path Switch to true
        // const adminPathSwitch = await screen.findByTestId('Admin Path Switch');
        // await waitFor(async () => {
        //     await user.click(adminpathSwitch);
        // });

        // Sort by Admin Name - Descending order
        await clickAndWaitForSorting(
            'Admin Name',
            [
                mockData.members[mockData.members.length - 1].name,
                mockData.members[mockData.members.length - 2].name
            ],
            false
        );

        // Sort by Admin Name- Ascending order
        await clickAndWaitForSorting('Admin Name', [mockData.members[0].name, mockData.members[1].name], true);


        // Sort by UH Number - Descending order
        await clickAndWaitForSorting(
            'UH Number',
            [
                mockData.members[mockData.members.length - 1].uhUuid,
                mockData.members[mockData.members.length - 2].uhUuid,
            ],
            false
        );

        //Sort by UH Number- Ascending Order
        await clickAndWaitForSorting('UH Number', [mockData.members[0].uhUuid, mockData.members[1].uhUuid], true);

        //  Sort by UH Username - Descending order
        await clickAndWaitForSorting(
            'UH Username',
            [
                mockData.members[mockData.members.length - 1].uid,
                mockData.members[mockData.members.length - 2].uid
            ],
            false
        );
        //  Sort by UH Username - Ascending order
        await clickAndWaitForSorting('UH Username', [mockData.members[0].uid, mockData.members[1].uid], true);


    }, 10000);

    it('should paginate correctly', async () => {
        render(<AdminTable groupingGroupMembers={mockData} />);

        const checkPageContent = async (buttonText: string, expectedRowStart: number, expectedRowEnd: number) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`name-example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`name-example-${expectedRowEnd}`)).toBeInTheDocument();
        };
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', mockData.members.length - pageSize, mockData.members.length - 1);
        await checkPageContent(
            'Previous',
            mockData.members.length - pageSize * 2,
            mockData.members.length - pageSize - 1
        );
    });
});
