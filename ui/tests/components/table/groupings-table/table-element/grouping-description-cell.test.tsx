import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingDescriptionCell from '@/components/table/groupings-table/table-element/grouping-description-cell';

describe('GroupingDescriptionCell', () => {
    it('renders the description inside TooltipOnTruncate', () => {
        const description = 'This is a test description';
        render(<GroupingDescriptionCell description={description} />);
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('renders description content for long text', () => {
        const description = 'This is a test description';
        render(<GroupingDescriptionCell description={description} />);
        expect(screen.getByText(description)).toBeInTheDocument();
    });
});
