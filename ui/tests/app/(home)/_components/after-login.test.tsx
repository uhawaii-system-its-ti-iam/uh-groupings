import { vi, describe, it, expect, beforeEach } from 'vitest';
import Role from '@/lib/access/role';
import { render, screen } from '@testing-library/react';
import User from '@/lib/access/user';
import * as Fetchers from '@/lib/fetchers';
import afterLogin from '@/app/(home)/_components/after-login';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

vi.mock('@/lib/fetchers');
vi.mock('@/lib/access/user.server', () => ({
    getUser: vi.fn(),
}));
vi.mock('@/lib/access/authorization', () => ({ setRoles: vi.fn() }));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('AfterLogin', () => {
    const numberOfGroupings = 18;
    const numberOfMemberships = 17;

    const admin: User = {
        ...testUser,
        roles: [Role.UH, Role.ADMIN] as const
    };

    const owner: User = {
        ...testUser,
        roles: [Role.UH, Role.OWNER] as const
    };

    const uhUser: User = {
        ...testUser,
        roles: [Role.UH] as const
    };

    const expectWelcome = (User: User, role: string) => {
        expect(screen.getAllByLabelText('user')[0]).toBeInTheDocument();
        expect(screen.getAllByLabelText('key-round')[0]).toBeInTheDocument();
        expect(screen.getByTestId('welcome-message')).toHaveTextContent(`Welcome, ${User.firstName}!`);
        expect(screen.getByTestId('role')).toHaveTextContent(`Role: ${role}`);
    };

    const expectAdministration = (isAdmin: boolean) => {
        if (isAdmin) {
            expect(screen.getByLabelText('key')).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Manage the list of Administrators for this service. ' +
                    'Search for and manage any grouping on behalf of the owner.'
                )
            ).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
            expect(screen.getByRole('button', { name: 'Admin' })).toBeInTheDocument();
        } else {
            expect(screen.queryByLabelText('key')).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Admin' })).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    'Manage the list of Administrators for this service. ' +
                    'Search for and manage any grouping on behalf of the owner.'
                )
            ).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Admin' })).not.toBeInTheDocument();
        }
    };

    const expectMemberships = () => {
        expect(screen.getByLabelText('id-card')).toBeInTheDocument();
        expect(screen.getByText(numberOfMemberships)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Memberships' })).toBeInTheDocument();
        expect(
            screen.getByText('View and manage my memberships. ' + 'Search for new groupings to join as a member.')
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
        expect(screen.getByRole('button', { name: 'Memberships' })).toBeInTheDocument();
    };

    const expectGroupings = (isAdmin: boolean, isOwner: boolean) => {
        if (isAdmin || isOwner) {
            expect(screen.getByLabelText('wrench')).toBeInTheDocument();
            expect(screen.getByText(numberOfGroupings)).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Groupings' })).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Review members, manage Include and Exclude lists, ' + 'configure preferences, and export members.'
                )
            ).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('button', { name: 'Groupings' })).toBeInTheDocument();
        } else {
            expect(screen.queryByLabelText('wrench')).not.toBeInTheDocument();
            expect(screen.queryByText(numberOfGroupings)).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    'Review members, manage Include and Exclude lists, ' + 'configure preferences, and export members.'
                )
            ).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Groupings' })).not.toBeInTheDocument();
        }
    };

    beforeEach(() => {
        vi.spyOn(Fetchers, 'getNumberOfGroupings').mockResolvedValue(numberOfGroupings);
        vi.spyOn(Fetchers, 'getNumberOfMemberships').mockResolvedValue(numberOfMemberships);
        vi.mocked(setRoles).mockImplementation(async (user) => user);
    });

    it('renders Better Auth session user content when the user is an admin', async () => {
        vi.mocked(getUser).mockResolvedValue(admin);
        render(await afterLogin());
        expectWelcome(admin, 'Admin');
        expectAdministration(true);
        expectMemberships();
        expectGroupings(true, false);
    });

    it('renders Better Auth session user content when the user is an owner', async () => {
        vi.mocked(getUser).mockResolvedValue(owner);
        render(await afterLogin());
        expectWelcome(owner, 'Owner');
        expectAdministration(false);
        expectMemberships();
        expectGroupings(false, true);
    });

    it('renders Better Auth session user content when the user has a UH account', async () => {
        vi.mocked(getUser).mockResolvedValue(uhUser);
        render(await afterLogin());
        expectWelcome(uhUser, 'Member');
        expectAdministration(false);
        expectMemberships();
        expectGroupings(false, false);
    });
});
