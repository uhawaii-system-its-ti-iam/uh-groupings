import { render, screen } from '@testing-library/react';
import GroupingsTab from '@/app/admin/@tab/manage-groupings/page';

describe('GroupingsTab', () => {
    it('renders Manage Groupings tab', () => {
        render(<GroupingsTab />);
        const heading = screen.getByRole('heading', { name: 'Testing Groupings' });
        expect(heading).toBeInTheDocument();
    });
});
