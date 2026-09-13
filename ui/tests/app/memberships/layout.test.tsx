import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipsLayout from '@/app/memberships/layout';
import Role from '@/lib/access/role';

vi.mock('@/lib/access/user.server', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

describe('MembershipsLayout', () => {
    it('renders the heading with correct props and children correctly', async () => {
        const tabContent = <div>Tab Content</div>;
        const { getUser } = await import('@/lib/access/user.server');
        const { setRoles } = await import('@/lib/access/authorization');
        const user = { roles: [Role.UH] };
        vi.mocked(getUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);
        render(await MembershipsLayout({ tab: tabContent }));

        expect(screen.getByText('Manage My Memberships')).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. Search for new groupings to join as a member.')
        ).toBeInTheDocument();
        expect(screen.getByText('Tab Content')).toBeInTheDocument();
    });
});
