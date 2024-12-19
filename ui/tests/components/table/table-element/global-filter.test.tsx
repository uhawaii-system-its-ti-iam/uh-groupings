import { vi, describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import GlobalFilter from '@/components/table/table-element/global-filter';

describe('GlobalFilter', () => {
    const mockSetFilter = vi.fn();

    it('renders the input with correct placeholder and value', () => {
        render(<GlobalFilter placeholder={'Filter Groupings...'} filter={'test'} setFilter={mockSetFilter} />);
        expect(screen.getByPlaceholderText('Filter Groupings...')).toHaveValue('test');
    });

    it('renders call setFilter when the input value changes', () => {
        render(<GlobalFilter placeholder={'Filter Groupings...'} filter={''} setFilter={mockSetFilter} />);

        fireEvent.change(screen.getByPlaceholderText('Filter Groupings...'), { target: { value: 'new test' } });
        expect(mockSetFilter).toHaveBeenCalledWith('new test');
    });
});
