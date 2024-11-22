import { render, screen } from '@testing-library/react';
import AdminTabsLayout from '@/app/admin/@tab/layout';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation');

describe('AdminTabsLayout', () => {
    it('renders the tab content', async () => {
        (usePathname as jest.Mock).mockReturnValue(`/admin`);
        render(<AdminTabsLayout></AdminTabsLayout>);

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Groupings' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Admins' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Manage Person' })).toBeInTheDocument();
    });
});
