import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import Role from '@/lib/access/role';

vi.mock('@/lib/access/user.server', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

describe('GroupingsLayout', () => {
    it('renders the heading with correct props and children correctly', async () => {
        const tabContent = <div>Child Content</div>;
        const { getUser } = await import('@/lib/access/user.server');
        const { setRoles } = await import('@/lib/access/authorization');
        const user = { roles: [Role.ADMIN] };
        vi.mocked(getUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);
        render(await AdminLayout({ tab: tabContent, modals: null }), { wrapper: withNuqsTestingAdapter() });

        expect(screen.getByText('UH Groupings Administration')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
