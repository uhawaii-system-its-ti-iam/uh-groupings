import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnSettings from '@/components/table/table-element/ColumnSettings';
import { Table } from '@tanstack/table-core';
import { GroupingPath } from '@/models/groupings-api-results';

const mockVisibilityState = {
    DESCRIPTION: true,
    'GROUPING PATH': true,
};

const mockToggleVisibility = jest.fn((columnKey: 'DESCRIPTION' | 'GROUPING PATH', newState) => {
    mockVisibilityState[columnKey] = newState;
});

const columnMocks = {
    DESCRIPTION: {
        toggleVisibility: (newState: boolean) => mockToggleVisibility('DESCRIPTION', newState),
    },
    'GROUPING PATH': {
        toggleVisibility: (newState: boolean) => mockToggleVisibility('GROUPING PATH', newState),
    },
};

const mockTable = {
    getColumn: jest.fn().mockImplementation((columnKey: 'DESCRIPTION' | 'GROUPING PATH') => {
        return {
            toggleVisibility: columnMocks[columnKey].toggleVisibility,
        };
    }),
} as unknown as Table<GroupingPath>;

describe('ColumnSettings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('toggles description column visibility with dropdown menu', async () => {
        render(<ColumnSettings table={mockTable} />);
        const user = userEvent.setup();

        // Open the dropdown menu
        const button = screen.getByTestId('column-settings-button');
        await act(() =>  (user.click(button)));

        // Verify switches are visible and their initial state
        const descriptionSwitch = await screen.findByTestId('description-switch');
        expect(descriptionSwitch).toBeVisible();
        expect(descriptionSwitch).toHaveAttribute('aria-checked', 'true');

        // Click the switch to toggle it
        await act(() => user.click(descriptionSwitch));
        expect(mockToggleVisibility).toHaveBeenCalledWith('DESCRIPTION', false);
        expect(descriptionSwitch).toHaveAttribute('aria-checked', 'false');

        // Ensure dropdown menu has closed
        await waitFor(() => {
            expect(screen.queryByTestId('description-switch')).not.toBeInTheDocument();
        });

        // Reopen the dropdown menu
        await act(() =>  user.click(button));

        // Click the switch again to toggle it back to true
        const reopenedDescriptionSwitch = await screen.findByTestId('description-switch');
        await act(() => user.click(reopenedDescriptionSwitch));
        expect(mockToggleVisibility).toHaveBeenCalledWith('DESCRIPTION', true);
        expect(reopenedDescriptionSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles grouping path column visibility with dropdown menu', async () => {
        render(<ColumnSettings table={mockTable} />);
        const user = userEvent.setup();

        // Open the dropdown menu
        const button = screen.getByTestId('column-settings-button');
        await act(() =>  (user.click(button)));

        // Verify switches are visible and their initial state
        const groupingPathSwitch = await screen.findByTestId('grouping-path-switch');
        expect(groupingPathSwitch).toBeVisible();
        expect(groupingPathSwitch).toHaveAttribute('aria-checked', 'true');

        // Click the switch to toggle it
        await act(() => user.click(groupingPathSwitch));
        expect(mockToggleVisibility).toHaveBeenCalledWith('GROUPING PATH', false);
        expect(groupingPathSwitch).toHaveAttribute('aria-checked', 'false');

        // Ensure dropdown menu has closed
        await waitFor(() => {
            expect(screen.queryByTestId('grouping-path-switch')).not.toBeInTheDocument();
        });

        // Reopen the dropdown menu
        await act(() => user.click(button));

        // Click the switch again to toggle it back to true
        const reopenedGroupingPathSwitch = await screen.findByTestId('grouping-path-switch');

        await act(() => user.click(reopenedGroupingPathSwitch));
        expect(mockToggleVisibility).toHaveBeenCalledWith('GROUPING PATH', true);
        expect(reopenedGroupingPathSwitch).toHaveAttribute('aria-checked', 'true');
    });
});
