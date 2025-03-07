import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipsLayout from '@/app/memberships/layout';

describe('MembershipsLayout', () => {
    it('renders the heading with correct props and children correctly', () => {
        const tabContent = <div>Tab Content</div>;
        render(<MembershipsLayout tab={tabContent} />);

        expect(screen.getByText('Manage My Memberships')).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. Search for new groupings to join as a member.')
        ).toBeInTheDocument();
        expect(screen.getByText('Tab Content')).toBeInTheDocument();
    });
});
