import GroupingMemberWhereListedCell from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/grouping-member-where-listed-cell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('GroupingMemberWhereListedCell', () => {
    const whereListed = 'Basis & Include';

    it('should render the whereListed string', () => {
        const { rerender } = render(<GroupingMemberWhereListedCell whereListed={whereListed} />);
        expect(screen.getByText(whereListed)).toBeInTheDocument();

        rerender(<GroupingMemberWhereListedCell whereListed={whereListed} isPending={false} />);
        expect(screen.getByText(whereListed)).toBeInTheDocument();
    });

    it('should not render the whereListed dstring if isPending is true', () => {
        render(<GroupingMemberWhereListedCell whereListed={whereListed} isPending={true} />);
        expect(screen.queryByText(whereListed)).not.toBeInTheDocument();
    });
});
