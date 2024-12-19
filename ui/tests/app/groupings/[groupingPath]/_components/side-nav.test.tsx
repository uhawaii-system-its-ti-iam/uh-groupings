import { vi, describe, beforeEach, it, expect, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import SideNav from '@/app/groupings/[groupingPath]/_components/side-nav';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation');

describe('SideNav Component', () => {
    const groupingPath = 'test-grouping';

    beforeEach(() => {
        (usePathname as Mock).mockReturnValue(`/groupings/${groupingPath}/all-members`);
    });

    it('renders link', () => {
        render(<SideNav groupingPath={groupingPath} />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(8);
        expect(links[0]).toHaveAttribute('href', `/groupings/${groupingPath}/all-members`);
    });

    it('generates href for each link based on groupingPath', () => {
        render(<SideNav groupingPath={groupingPath} />);

        const links = screen.getAllByRole('link');
        const expectedHrefs = [
            `/groupings/${groupingPath}/all-members`,
            `/groupings/${groupingPath}/basis`,
            `/groupings/${groupingPath}/include`,
            `/groupings/${groupingPath}/exclude`,
            `/groupings/${groupingPath}/owners`,
            `/groupings/${groupingPath}/sync-destinations`,
            `/groupings/${groupingPath}/preferences`,
            `/groupings/${groupingPath}/actions`
        ];

        links.forEach((link, index) => {
            expect(link).toHaveAttribute('href', expectedHrefs[index]);
        });
    });
});
