import AdminLayout from '@/app/admin/layout';
import Admin from '@/app/admin/page';
import { render, screen } from '@testing-library/react';

describe('Admin', () => {
    it('should render the Admin page with the appropriate header and tabs', () => {
        render(
            <AdminLayout>
                <Admin />
            </AdminLayout>
        );
        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'UH Groupings Administration' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. ' +
                    'Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Groupings' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Admins' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Person' })).toBeInTheDocument();
    });
});
