import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import GroupingsTable from "@/components/table/GroupingsTable";
import userEvent from '@testing-library/user-event';


const generateSampleData = Array.from({length: 200}, (_, i) => ({
    path: `tmp:example:example-${i}`,
    name: `example-${i}`,
    description: `Test Description ${i}`
}));

const clickAndWaitForSorting = async (
    headerText: string,
    expectedOrder: string[],
    isAscending = true
) => {
    fireEvent.click(screen.getByText(headerText));
    await waitFor(() => {
        const chevronIcon = screen.getByTestId(isAscending ? 'chevron-up-icon' : 'chevron-down-icon');
        expect(chevronIcon).toBeInTheDocument();
    });
    const rows = screen.getAllByRole('row');
    expectedOrder.forEach((item, index) => {
        expect(rows[index + 1]).toHaveTextContent(item);
    });
};

describe('GroupingsTable', () => {
    test('renders table correctly', () => {
        render(<GroupingsTable data={generateSampleData}/>);

        // Check for "Manage Groupings", filter, and column settings
        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Filter Groupings...')).toBeInTheDocument();
        expect(screen.getByTestId('column-settings-button')).toBeInTheDocument();

        // check for table column headers
        expect(screen.getByText('GROUPING NAME')).toBeInTheDocument();
        expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
        expect(screen.getByText('GROUPING PATH')).toBeInTheDocument();
        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();

        expect(screen.getAllByRole('row').length).toBeLessThanOrEqual(generateSampleData.length);

        const first20Groupings = generateSampleData.slice(0, 20); // table has 20 rows
        first20Groupings.forEach((group,index) => {
            expect(screen.getByTestId(`square-pen-icon-${index}`)).toBeInTheDocument();
            expect(screen.getByText(group.name)).toBeInTheDocument();
            expect(screen.getByText(group.description)).toBeInTheDocument();
            expect(screen.getByDisplayValue(group.path)).toBeInTheDocument();
            expect(screen.getByTestId(`clipboard-button-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`clipboard-icon-${index}`)).toBeInTheDocument();
        });

        // check for pagination
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText(1)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('filters data correctly using global filter', () => {
        render(<GroupingsTable data={generateSampleData}/>);

        const filterInput = screen.getByPlaceholderText('Filter Groupings...');
        fireEvent.change(filterInput, {target: {value: '1'}});

        expect(screen.getByText('example-1')).toBeInTheDocument();
        expect(screen.queryByText('example-0')).not.toBeInTheDocument();

        fireEvent.change(filterInput, {target: {value: '0'}});
        expect(screen.getByText('example-0')).toBeInTheDocument();
        expect(screen.queryByText('example-1')).not.toBeInTheDocument();
    });

    it('sorts data when header is clicked', async () => {
        render(<GroupingsTable data={generateSampleData} />);

        // Sort by grouping name
        await clickAndWaitForSorting('GROUPING NAME', [
            'example-0',
            'example-1'
        ], true);

        // Descending order
        await clickAndWaitForSorting('GROUPING NAME', [
            `example-${generateSampleData.length - 1}`,
            `example-${generateSampleData.length - 2}`
        ], false);

        // Sort by description
        await clickAndWaitForSorting('DESCRIPTION', [
            'Test Description 0',
            'Test Description 1'
        ], true);

        // Descending order
        await clickAndWaitForSorting('DESCRIPTION', [
            `Test Description ${generateSampleData.length - 1}`,
            `Test Description ${generateSampleData.length - 2}`
        ], false);

        // Sort by grouping path
        await clickAndWaitForSorting('GROUPING PATH', [
            'example-0',
            'example-1'
        ], true);

        // Descending order
        await clickAndWaitForSorting('GROUPING PATH', [
            `example-${generateSampleData.length - 1}`,
            `example-${generateSampleData.length - 2}`
        ], false);
    });

    it('column settings', async () => {
        render(<GroupingsTable data={generateSampleData}/>);
        const button = screen.getByTestId('column-settings-button');
        const user = userEvent.setup();

        const toggleColumnVisibility = async (columnTestId: string, isVisible: boolean) => {
            await act(async () => {
                await user.click(button);
            });
            fireEvent.click(screen.getByTestId(columnTestId));
            if (isVisible) {
                // check getByText('DESCRIPTION') or getBYText('GROUPING PATH') to be in document
                expect(screen.getByText(columnTestId.replace('-switch', '').replace('-', ' ').toUpperCase())).toBeInTheDocument();
            } else {
                expect(screen.queryByText(columnTestId.replace('-switch', '').replace('-', ' ').toUpperCase())).not.toBeInTheDocument();
            }
        };
        // Toggle description column
        await toggleColumnVisibility('description-switch', false);
        await toggleColumnVisibility('description-switch', true);

        // Toggle grouping path column
        await toggleColumnVisibility('grouping-path-switch', false);
        await toggleColumnVisibility('grouping-path-switch', true);
    });

    it('clipboard buttons work correctly when clicked', async () => {
        if (!navigator.clipboard) {
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: jest.fn(() => Promise.resolve()),
                },
                writable: true,
            });
        } else {
            jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => Promise.resolve());
        }

        render(<GroupingsTable data={generateSampleData} />);

        const clipboardIcon0 = screen.getByTestId('clipboard-icon-0');
        const clipboardIcon1 = screen.getByTestId('clipboard-icon-1');

        fireEvent.click(clipboardIcon0);
        await waitFor(() => {
            expect(screen.getAllByText('copied!')[0]).toBeInTheDocument();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('tmp:example:example-0');
        });

        fireEvent.click(clipboardIcon1);
        await waitFor(() => {
            expect(screen.getAllByText('copied!')[0]).toBeInTheDocument();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('tmp:example:example-1');
        });
    });

    it('Pagination buttons work correctly', async () => {
        const pageSize = 20;
        render(<GroupingsTable data={generateSampleData}/>);

        const checkPageContent = async(
            buttonText: string,
            expectedRowStart: number,
            expectedRowEnd: number,
        ) => {
            fireEvent.click(screen.getByText(buttonText));
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(pageSize + 1); // +1 for header row
            expect(screen.getByText(`example-${expectedRowStart}`)).toBeInTheDocument();
            expect(screen.getByText(`example-${expectedRowEnd}`)).toBeInTheDocument();
        }
        await checkPageContent('First', 0, pageSize - 1);
        await checkPageContent('Next', pageSize, pageSize * 2 - 1);
        await checkPageContent('Last', generateSampleData.length - pageSize, generateSampleData.length - 1);
        await checkPageContent('Previous', generateSampleData.length - (pageSize * 2) , generateSampleData.length - pageSize -1);
    });
});