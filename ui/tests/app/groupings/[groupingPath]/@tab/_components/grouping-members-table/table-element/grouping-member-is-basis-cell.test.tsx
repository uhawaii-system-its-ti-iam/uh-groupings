import GroupingMemberIsBasisCell from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/grouping-member-is-basis-cell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('GroupingMemberIsBasisCell', () => {
    it('should render "Yes" if whereListed is Basis', () => {
        const { rerender } = render(<GroupingMemberIsBasisCell whereListed={'Basis'} />);
        expect(screen.getByText('Yes')).toBeInTheDocument();

        rerender(<GroupingMemberIsBasisCell whereListed="Basis" isPending={false} />);
        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('should render "No" if whereListed is not Basis', () => {
        const { rerender } = render(<GroupingMemberIsBasisCell whereListed="Include" />);
        expect(screen.getByText('No')).toBeInTheDocument();

        rerender(<GroupingMemberIsBasisCell whereListed="Basis & Include" />);
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should not render "Yes" or "No" if isPending is true', () => {
        render(<GroupingMemberIsBasisCell whereListed="Basis" isPending={true} />);
        expect(screen.queryByText('Yes')).not.toBeInTheDocument();
        expect(screen.queryByText('No')).not.toBeInTheDocument();
    });
});
