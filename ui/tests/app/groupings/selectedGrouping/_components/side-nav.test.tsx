import { render, screen } from '@testing-library/react';
import SideNav from '@/app/groupings/[selectedGrouping]/_components/side-nav';
import { usePathname } from 'next/navigation';
import '@testing-library/jest-dom';

describe('SideNav Component', () => {
    const selectedGrouping = 'test-grouping';

    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue(`/groupings/${selectedGrouping}/all`);
    });

    it('renders link', () => {
        render(
            <SideNav selectedGrouping={selectedGrouping} />
        );

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(8);
        expect(links[0]).toHaveAttribute('href', `/groupings/${selectedGrouping}/all`);
    });

    it('generates href for each link based on selectedGrouping', () => {
        render(
            <SideNav selectedGrouping={selectedGrouping} />
        );

        const links = screen.getAllByRole('link');
        const expectedHrefs = [
            `/groupings/${selectedGrouping}/all`,
            `/groupings/${selectedGrouping}/basis`,
            `/groupings/${selectedGrouping}/include`,
            `/groupings/${selectedGrouping}/exclude`,
            `/groupings/${selectedGrouping}/owners`,
            `/groupings/${selectedGrouping}/sync-destinations`,
            `/groupings/${selectedGrouping}/preferences`,
            `/groupings/${selectedGrouping}/actions`,
        ];

        links.forEach((link, index) => {
            expect(link).toHaveAttribute('href', expectedHrefs[index]);
        });
    });

});
