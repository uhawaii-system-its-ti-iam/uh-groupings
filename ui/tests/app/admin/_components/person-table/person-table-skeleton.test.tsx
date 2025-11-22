import PersonTableSkeleton from '@/app/admin/_components/person-table/person-table-skeleton';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('PersonTableSkeleton', () => {
    it('renders table headers and skeleton rows', () => {
        render(<PersonTableSkeleton />);
        const headers = screen.getAllByRole('columnheader');
        const rows = screen.getAllByRole('row');
        expect(headers.length).toBeGreaterThan(0);
        expect(rows.length).toBeGreaterThan(1);
    });

    it('renders the loading button skeleton', () => {
        const { container } = render(<PersonTableSkeleton />);
        const skeletonButtons = container.querySelectorAll('.h-10.w-80');
        expect(skeletonButtons.length).toBeGreaterThan(0);
    });
});
