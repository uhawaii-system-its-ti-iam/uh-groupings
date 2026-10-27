import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipsLayout from '@/app/memberships/layout';
import Role from '@/lib/access/role';
import { getAuthorizedUser } from '@/lib/access/user.server';
import { redirect } from 'next/navigation';

vi.mock('@/lib/access/user.server', () => ({ getAuthorizedUser: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

describe('MembershipsLayout', () => {
    beforeEach(() => vi.resetAllMocks());

    it('renders the heading and tab content for a user with the UH role', async () => {
        vi.mocked(getAuthorizedUser).mockResolvedValue({ roles: [Role.UH] } as never);
        render(await MembershipsLayout({ tab: <div>Tab Content</div> }));

        expect(screen.getByRole('heading', { name: 'Manage My Memberships' })).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. Search for new groupings to join as a member.')
        ).toBeInTheDocument();
        expect(screen.getByText('Tab Content')).toBeInTheDocument();
        expect(redirect).not.toHaveBeenCalled();
    });

    it('redirects a user without the UH role before rendering tab content', async () => {
        vi.mocked(getAuthorizedUser).mockResolvedValue({ roles: [Role.ANONYMOUS] } as never);
        const redirectError = new Error('NEXT_REDIRECT');
        // Next.js redirect throws to stop rendering the protected route.
        vi.mocked(redirect).mockImplementation(() => { throw redirectError; });

        await expect(MembershipsLayout({ tab: <div>Protected Content</div> })).rejects.toThrow(redirectError);

        expect(redirect).toHaveBeenCalledExactlyOnceWith('/');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
});
