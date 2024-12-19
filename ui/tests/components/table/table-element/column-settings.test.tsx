import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnSettings from '@/components/table/table-element/column-settings';
import { Table } from '@tanstack/table-core';
import { GroupingPath } from '@/lib/types';

const mockColumnVisibility = {
    description: true,
    path: false
};

const mockColumns = [
    {
        id: 'description',
        getCanHide: () => true,
        getIsVisible: () => mockColumnVisibility['description'],
        columnDef: { header: 'description' },
        toggleVisibility: vi.fn((isVisible: boolean) => {
            mockColumnVisibility['description'] = isVisible;
        })
    },
    {
        id: 'path',
        getCanHide: () => true,
        getIsVisible: () => mockColumnVisibility['path'],
        columnDef: { header: 'path' },
        toggleVisibility: vi.fn((isVisible: boolean) => {
            mockColumnVisibility['path'] = isVisible;
        })
    }
];

const mockGetAllColumns = vi.fn().mockReturnValue(mockColumns);

const mockTable = {
    getAllColumns: mockGetAllColumns
} as unknown as Table<GroupingPath>;

describe('ColumnSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockColumnVisibility.description = true;
        mockColumnVisibility.path = false;
    });

    it('toggles description column visibility', async () => {
        render(<ColumnSettings table={mockTable} />);
        const user = userEvent.setup();

        // Open the dropdown menu
        const button = screen.getByLabelText('column-settings-button');
        await waitFor(async () => {
            await user.click(button);
        });

        const descriptionSwitch = screen.getByTestId('description Switch');

        // Initially, it should be checked (true)
        expect(descriptionSwitch).toBeChecked();
        expect(mockColumnVisibility['description']).toBeTruthy(); // Visibility should be true

        // Toggle switch to unchecked (false)
        await waitFor(async () => {
            await user.click(descriptionSwitch);
            expect(mockColumnVisibility['description']).toBeFalsy(); // Visibility should be false
        });

        // Ensure dropdown menu has closed
        await waitFor(() => {
            expect(screen.queryByTestId('description Switch')).not.toBeInTheDocument();
        });

        await waitFor(async () => {
            await user.click(button);
        });

        const reopenedDescriptionSwitch = await screen.findByTestId('description Switch');
        await waitFor(async () => {
            await user.click(reopenedDescriptionSwitch);
            expect(reopenedDescriptionSwitch).toBeChecked();
        });
    });

    it('toggles grouping path column visibility', async () => {
        render(<ColumnSettings table={mockTable} />);
        const user = userEvent.setup();

        // Open the dropdown menu
        const button = screen.getByLabelText('column-settings-button');
        await waitFor(async () => {
            await user.click(button);
        });

        const pathSwitch = screen.getByTestId('path Switch');

        // Initially, it should be checked (true)
        expect(pathSwitch).not.toBeChecked();
        expect(mockColumnVisibility['path']).toBeFalsy(); // Visibility should be false

        // Toggle switch to checked (true)
        await waitFor(async () => {
            await user.click(pathSwitch);
            expect(mockColumnVisibility['path']).toBeTruthy(); // Visibility should be true
        });

        // Ensure dropdown menu has closed
        await waitFor(() => {
            expect(screen.queryByTestId('path Switch')).not.toBeInTheDocument();
        });

        await waitFor(async () => {
            await user.click(button);
        });

        const reopenedPathSwitch = await screen.findByTestId('path Switch');
        await waitFor(async () => {
            await user.click(reopenedPathSwitch);
            expect(reopenedPathSwitch).toHaveAttribute('aria-checked', 'false');
        });
    });
});
