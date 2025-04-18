import { render, screen } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import { usePathname } from 'next/navigation';
import AdminTabsLayout from '@/app/admin/@tab/layout';

vi.mock('next/navigation', () => ({
    usePathname: vi.fn()
}));

describe('AdminTabsLayout', () => {
    it('renders all tab links correctly', () => {
        (usePathname as vi.Mock).mockReturnValue('/admin/manage-groupings');

        render(<AdminTabsLayout>Mock Content</AdminTabsLayout>);

        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        expect(screen.getByText('Manage Admins')).toBeInTheDocument();
        expect(screen.getByText('Manage Person')).toBeInTheDocument();
    });

    it('sets correct tab value based on pathname', () => {
        (usePathname as vi.Mock).mockReturnValue('/admin/manage-person');

        render(<AdminTabsLayout>Mock Content</AdminTabsLayout>);

        expect(screen.getByText('Manage Person')).toBeInTheDocument();
    });
});
