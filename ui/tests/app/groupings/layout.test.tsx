import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingsLayout from '@/app/groupings/layout';

describe('GroupingsLayout', () => {
    it('renders the heading with correct props and children correctly', () => {
        const children = <div>Child Content</div>;
        render(<GroupingsLayout>{children}</GroupingsLayout>);

        expect(screen.getByText('Manage My Groupings')).toBeInTheDocument();
        expect(
            screen.getByText(
                'View and manage groupings I own. Manage members, ' +
                    'configure grouping options and sync destinations.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
