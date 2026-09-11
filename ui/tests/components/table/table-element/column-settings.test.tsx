import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColumnSettings from '@/components/table/table-element/column-settings';
import { Table } from '@tanstack/table-core';
import { GroupingPath } from '@/lib/types';

vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: { children: any }) => <div>{children}</div>,
    DropdownMenuItem: ({ children }: { children: any }) => <div>{children}</div>
}));

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

        const descriptionSwitch = await screen.findByTestId('description Switch');

        // Initially, it should be checked (true)
        expect(descriptionSwitch).toBeChecked();
        expect(mockColumnVisibility['description']).toBeTruthy(); // Visibility should be true

        // Toggle switch to unchecked (false)
        await user.click(descriptionSwitch);
        expect(mockColumnVisibility['description']).toBeFalsy(); // Visibility should be false

        await user.click(descriptionSwitch);
        expect(descriptionSwitch).toBeChecked();
    });

    it('toggles grouping path column visibility', async () => {
        render(<ColumnSettings table={mockTable} />);
        const user = userEvent.setup();

        const pathSwitch = await screen.findByTestId('path Switch');

        // Initially, it should be checked (true)
        expect(pathSwitch).not.toBeChecked();
        expect(mockColumnVisibility['path']).toBeFalsy(); // Visibility should be false

        // Toggle switch to checked (true)
        await user.click(pathSwitch);
        expect(mockColumnVisibility['path']).toBeTruthy(); // Visibility should be true

        await user.click(pathSwitch);
        expect(pathSwitch).toHaveAttribute('aria-checked', 'false');
    });
});
