import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { usePathname, useSearchParams } from 'next/navigation';
import GroupingsHeading from '@/components/layout/groupings-heading';

vi.mock('next/navigation', () => ({ usePathname: vi.fn(), useSearchParams: vi.fn() }));

const setRoute = (pathname: string, query = '') => {
    vi.mocked(usePathname).mockReturnValue(pathname);
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(query) as ReturnType<typeof useSearchParams>);
};

describe('GroupingsHeading', () => {
    it.each([
        ['/groupings', '', 'Manage My Groupings'],
        ['/groupings', 'from=admin', 'Manage My Groupings'],
        ['/groupings/test/all-members', '', 'Manage My Groupings'],
        ['/groupings/test/all-members', 'from=groupings', 'Manage My Groupings'],
        ['/groupings/test/all-members', 'from=unknown', 'Manage My Groupings'],
        ['/groupings/test/all-members', 'from=groupings&from=admin', 'UH Groupings Administration'],
        ['/groupings/test/all-members', 'from=admin&from=groupings', 'UH Groupings Administration'],
        ['/groupings/test', 'from=admin', 'UH Groupings Administration'],
        ['/groupings/test/all-members', 'from=admin', 'UH Groupings Administration'],
        ['/groupings/test/preferences', 'from=admin', 'UH Groupings Administration']
    ])('renders %s?%s with heading %s on initial access', (pathname, query, title) => {
        setRoute(pathname, query);
        render(<GroupingsHeading />);
        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
        const description = title === 'UH Groupings Administration'
            ? 'Search for and manage any grouping on behalf of its owner. Manage the list of UH Groupings administrators.'
            : 'View and manage groupings I own. Manage members, configure grouping options and sync destinations.';
        expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('updates context during navigation without remounting the layout', () => {
        setRoute('/groupings');
        const { rerender } = render(<GroupingsHeading />);
        setRoute('/groupings/test/all-members', 'from=admin');
        rerender(<GroupingsHeading />);
        expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        expect(screen.queryByText('Manage My Groupings')).not.toBeInTheDocument();
        setRoute('/groupings/test/preferences', 'from=admin');
        rerender(<GroupingsHeading />);
        expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        setRoute('/groupings');
        rerender(<GroupingsHeading />);
        expect(screen.getByRole('heading', { name: 'Manage My Groupings' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'UH Groupings Administration' })).not.toBeInTheDocument();
    });
});
