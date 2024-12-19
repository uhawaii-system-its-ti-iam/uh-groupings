import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SortArrow from '@/components/table/table-element/sort-arrow';

describe('SortArrow', () => {
    it('render ChevronDown icon when direction is "asc"', () => {
        render(<SortArrow direction={'asc'} />);
        expect(screen.getByTestId('chevron-down-icon'));
    });

    it('renders ChevronUp icon when direction is "desc"', () => {
        render(<SortArrow direction={'desc'} />);
        expect(screen.getByTestId('chevron-up-icon'));
    });

    it('renders nothing when direction is not provided', () => {
        render(<SortArrow direction={'undefined'} />);

        expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
    });
});
