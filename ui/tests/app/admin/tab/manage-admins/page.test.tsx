import { render, screen } from '@testing-library/react';
import AdminsTab from '@/app/admin/@tab/manage-admins/page';

describe('AdminsTab', () => {
    it('renders Manage Admins tab', () => {
        render(<AdminsTab />);
        const heading = screen.getByRole('heading', { name: 'Testing Admins' });
        expect(heading).toBeInTheDocument();
    });
});
