import { describe, it, expect } from 'vitest';
import MembershipsLayout from '@/app/memberships/layout';
import Memberships from '@/app/memberships/page';
import { render, screen } from '@testing-library/react';

describe('Memberships', () => {
    it('should render the Memberhsips page with the appropriate header and tabs', () => {
        render(
            <MembershipsLayout>
                <Memberships />
            </MembershipsLayout>
        );
        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'Manage My Memberships' })).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. Search for new groupings to join as a member.')
        ).toBeInTheDocument();

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Current Memberships' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Membership Opportunities' })).toBeInTheDocument();
    });
});
