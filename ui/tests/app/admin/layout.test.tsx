import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';

describe('AdminLayout', () => {
    it('should render the Admin page with the appropriate header and tabs', () => {
        render(<AdminLayout></AdminLayout>);
        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. ' +
                    'Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();
    });
});
