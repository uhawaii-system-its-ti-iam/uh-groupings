import { render, screen } from '@testing-library/react';
import AdminTabsLayout from '@/app/admin/@tab/layout';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
    usePathname: vi.fn(),
}));

describe('AdminTabsLayout', () => {
    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue('/admin/manage-person');
    });

    it('renders the correct active tab', () => {
        render(<AdminTabsLayout><div>Child Content</div></AdminTabsLayout>);
        expect(screen.getByText('Manage Person')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders all navigation tabs', () => {
        render(<AdminTabsLayout><div /></AdminTabsLayout>);
        expect(screen.getByText('Manage Groupings')).toBeInTheDocument();
        expect(screen.getByText('Manage Admins')).toBeInTheDocument();
        expect(screen.getByText('Manage Person')).toBeInTheDocument();
    });
});
