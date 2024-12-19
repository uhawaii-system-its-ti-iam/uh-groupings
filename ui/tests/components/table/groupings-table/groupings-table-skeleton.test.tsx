import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';
import { render, screen } from '@testing-library/react';

describe('GroupingsTableSkeleton', () => {
    it('should render', () => {
        render(<GroupingsTableSkeleton />);
        expect(screen.getByRole('heading', { name: 'Manage Groupings' })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
