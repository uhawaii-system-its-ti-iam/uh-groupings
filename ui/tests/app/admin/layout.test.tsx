import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/admin/layout';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import Role from '@/lib/access/role';
import { redirect } from 'next/navigation';

vi.mock('@/lib/access/user.server', () => ({ getAuthorizedUser: vi.fn() }));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

describe('AdminLayout', () => {
    beforeEach(() => vi.resetAllMocks());

    it('renders the heading with correct props and children correctly', async () => {
        const tabContent = <div>Child Content</div>;
        const { getAuthorizedUser } = await import('@/lib/access/user.server');
        const { setRoles } = await import('@/lib/access/authorization');
        const user = { roles: [Role.ADMIN] };
        vi.mocked(getAuthorizedUser).mockResolvedValue(user as never);
        vi.mocked(setRoles).mockResolvedValue(user as never);
        render(await AdminLayout({ tab: tabContent, modals: null }), { wrapper: withNuqsTestingAdapter() });

        expect(screen.getByText('UH Groupings Administration')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Search for and manage any grouping on behalf of its owner. Manage the list of UH Groupings administrators.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(redirect).not.toHaveBeenCalled();
    });
    it('redirects a user without the Admin role before rendering protected content', async () => {
        const { getAuthorizedUser } = await import('@/lib/access/user.server');
        vi.mocked(getAuthorizedUser).mockResolvedValue({ roles: [Role.UH, Role.OWNER] } as never);
        const redirectError = new Error('NEXT_REDIRECT');
        // Next.js redirect throws to stop rendering the protected route.
        vi.mocked(redirect).mockImplementation(() => { throw redirectError; });

        await expect(AdminLayout({
            tab: <div>Protected Admin Content</div>,
            modals: <div>Protected Admin Modal</div>
        })).rejects.toThrow(redirectError);

        expect(redirect).toHaveBeenCalledExactlyOnceWith('/');
        expect(screen.queryByText('Protected Admin Content')).not.toBeInTheDocument();
        expect(screen.queryByText('Protected Admin Modal')).not.toBeInTheDocument();
    });
});
