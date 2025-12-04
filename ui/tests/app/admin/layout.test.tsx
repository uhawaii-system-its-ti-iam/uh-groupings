import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';

describe('GroupingsLayout', () => {
    it('renders the heading with correct props and children correctly', () => {
        const tabContent = <div>Child Content</div>;
        render(<AdminLayout tab={tabContent}/>, { wrapper: withNuqsTestingAdapter() });

        expect(screen.getByText('UH Groupings Administration')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
