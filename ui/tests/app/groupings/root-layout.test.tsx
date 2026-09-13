import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GroupingsLayout from '@/app/groupings/layout';
import Role from '@/lib/access/role';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';
import { redirect } from 'next/navigation';

vi.mock('@/lib/access/user.server', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

describe('GroupingsLayout', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders for a Better Auth user with the owner role', async () => {
        const user = { roles: [Role.OWNER] };
        vi.mocked(getUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);

        render(await GroupingsLayout({ children: <div>Grouping content</div> }));

        expect(screen.getByText('Manage My Groupings')).toBeInTheDocument();
        expect(screen.getByText('Grouping content')).toBeInTheDocument();
        expect(redirect).not.toHaveBeenCalled();
    });

    it('redirects an authenticated user without owner or admin access', async () => {
        const user = { roles: [Role.UH] };
        vi.mocked(getUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);

        await GroupingsLayout({ children: null });

        expect(redirect).toHaveBeenCalledWith('/');
    });
});
