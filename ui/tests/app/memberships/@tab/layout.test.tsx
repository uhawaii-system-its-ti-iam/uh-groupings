import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipsTabLayout from '@/app/memberships/@tab/layout';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
    usePathname: vi.fn()
}));

describe('MembershipsTabLayout', () => {
    it('renders children correctly', () => {
        (usePathname as Mock).mockReturnValue('/memberships/current');

        const testContent = <div>Test Child Content</div>;
        render(<MembershipsTabLayout>{testContent}</MembershipsTabLayout>);

        expect(screen.getByText('Test Child Content')).toBeInTheDocument();
    });

    it('renders tabs correctly', () => {
        (usePathname as Mock).mockReturnValue('/memberships/current');

        render(
            <MembershipsTabLayout>
                <div />
            </MembershipsTabLayout>
        );

        expect(screen.getByText('Current Memberships')).toBeInTheDocument();
        expect(screen.getByText('Membership Opportunities')).toBeInTheDocument();
    });

    it('sets the correct tab as active based on pathname', () => {
        (usePathname as Mock).mockReturnValue('/memberships/opportunities');

        render(
            <MembershipsTabLayout>
                <div />
            </MembershipsTabLayout>
        );

        expect(screen.getByText('Membership Opportunities')).toBeInTheDocument();
        expect(screen.getByText('Membership Opportunities').getAttribute('data-state')).toBe('active');
    });
});
