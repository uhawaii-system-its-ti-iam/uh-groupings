import { render, screen } from '@testing-library/react';
import Groupings from '@/app/groupings/page';

describe('Groupings', () => {

    it('should render the Groupings page with the appropriate header', () => {
        render(<Groupings />);
        expect(screen.getByRole('main')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'Manage My Groupings' })).toBeInTheDocument();
        expect(screen.getByText('View and manage groupings I own. ' +
            'Manage members, configure grouping options and sync destinations.')).toBeInTheDocument();
    });

});
