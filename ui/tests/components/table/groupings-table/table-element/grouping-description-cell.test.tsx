import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupingDescriptionCell from '@/components/table/groupings-table/table-element/grouping-description-cell';

describe('GroupingDescriptionCell', () => {
    it('renders the description inside TooltipOnTruncate', () => {
        const description = 'This is a test description';
        render(<GroupingDescriptionCell description={description} />);
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('should show tooltip if description content is truncated', async () => {
        Object.defineProperties(HTMLElement.prototype, {
            scrollWidth: { get: () => 500, configurable: true },
            clientWidth: { get: () => 30, configurable: true }
        });

        const description = 'This is a test description';
        render(<GroupingDescriptionCell description={description} />);

        const descriptionComponent = screen.getByText(description);
        await userEvent.hover(descriptionComponent);

        await waitFor(() => {
            expect(screen.getAllByTestId('tooltip-on-truncate')[0]).toBeInTheDocument();
        });
    });
});
