import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('GroupingsTableSkeleton', () => {
    it('should render', () => {
        render(<GroupingsTableSkeleton />);
        expect(screen.getByRole('heading', { name: 'Manage Groupings' })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
