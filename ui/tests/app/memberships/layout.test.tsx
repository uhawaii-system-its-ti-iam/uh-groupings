import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipsLayout from '@/app/memberships/layout';

describe('MembershipsLayout', () => {
    it('renders the heading with correct props and children correctly', () => {
        const children = <div>Child Content</div>;
        render(<MembershipsLayout>{children}</MembershipsLayout>);

        expect(screen.getByText('Manage My Memberships')).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. Search for new groupings to join as a member.')
        ).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
