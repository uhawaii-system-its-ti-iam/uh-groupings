import GroupingMembersTableSkeleton from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table-skeleton';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('GroupingMembersTableSkeleton', () => {
    it('should render with the All Members heading', () => {
        render(<GroupingMembersTableSkeleton />);
        expect(screen.getByRole('heading', { name: 'All Members' })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render with the group heading', () => {
        render(<GroupingMembersTableSkeleton group="include" />);
        expect(screen.getByRole('heading', { name: 'include' })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
