import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from '@tanstack/table-core';
import { GroupingPath } from '@/lib/types';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import userEvent from '@testing-library/user-event';

const mockGetPageCount = vi.fn();
const mockGetCanPreviousPage = vi.fn();
const mockGetCanNextPage = vi.fn();
const mockFirstPage = vi.fn();
const mockPreviousPage = vi.fn();
const mockNextPage = vi.fn();
const mockLastPage = vi.fn();
const mockRowCount = vi.fn();

const state = {
    pagination: {
        pageIndex: 1
    }
};
const mockState = vi.fn(() => state);
const mockSetPageIndex = vi.fn((pageIndex) => {
    state.pagination.pageIndex = pageIndex;
});

const mockTable = {
    getPageCount: mockGetPageCount,
    getCanPreviousPage: mockGetCanPreviousPage,
    getCanNextPage: mockGetCanNextPage,
    firstPage: mockFirstPage,
    previousPage: mockPreviousPage,
    setPageIndex: mockSetPageIndex,
    nextPage: mockNextPage,
    lastPage: mockLastPage,
    getRowCount: mockRowCount,
    getState: mockState
} as unknown as Table<GroupingPath>;

describe('Pagination', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders pagination Bar correctly', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(6);
        mockGetCanPreviousPage.mockReturnValue(true);
        mockGetCanNextPage.mockReturnValue(true);

        const { rerender } = render(<PaginationBar table={mockTable} />);

        // Ensure page numbers and buttons are rendered
        await user.click(screen.getByText('3'));
        rerender(<PaginationBar table={mockTable} />);

        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.queryByText('6')).not.toBeInTheDocument(); // 6 should not be rendered
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('navigates to a specific page when the page number is clicked', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(5);
        mockGetCanPreviousPage.mockReturnValue(true);
        mockGetCanNextPage.mockReturnValue(true);

        render(<PaginationBar table={mockTable} />);

        // Navigate to a specific page
        await user.click(screen.getByText('3'));
        expect(mockSetPageIndex).toHaveBeenCalledWith(2); // Page index 2 corresponds to page 3
    });

    it('navigates to the first page when "First" is clicked', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(5);
        mockGetCanPreviousPage.mockReturnValue(true);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('First'));
        expect(mockFirstPage).toHaveBeenCalled();
    });

    it('navigates to the previous page when "Previous" is clicked', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(5);
        mockGetCanPreviousPage.mockReturnValue(true);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('Previous'));
        expect(mockPreviousPage).toHaveBeenCalled();
    });

    it('navigates to the next page when "next" is clicked', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(5);
        mockGetCanNextPage.mockReturnValue(true);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('Next'));
        expect(mockNextPage).toHaveBeenCalled();
    });

    it('navigates to the last page when "last" is clicked', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(5);
        mockGetCanNextPage.mockReturnValue(true);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('Last'));
        expect(mockLastPage).toHaveBeenCalled();
    });

    it('disables "Previous" and "First" buttons when on the first page', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(1);
        mockGetCanPreviousPage.mockReturnValue(false);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('First'));
        expect(mockFirstPage).not.toHaveBeenCalled();

        await user.click(screen.getByText('Previous'));
        expect(mockPreviousPage).not.toHaveBeenCalled();
    });

    it('disables "Next" and "Last" buttons when on the last page', async () => {
        const user = userEvent.setup();

        mockGetPageCount.mockReturnValue(1);
        mockGetCanNextPage.mockReturnValue(false);

        render(<PaginationBar table={mockTable} />);

        await user.click(screen.getByText('Next'));
        expect(mockNextPage).not.toHaveBeenCalled();

        await user.click(screen.getByText('Last'));
        expect(mockLastPage).not.toHaveBeenCalled();
        expect(mockGetPageCount).toHaveBeenCalled();
    });
});
