import Role from '@/access/role';
import { render, screen } from '@testing-library/react';
import User from '@/access/user';
import * as Fetchers from '@/lib/fetchers';
import * as Authentication from '@/access/authentication';
import afterLogin from '@/app/(home)/_components/after-login';

jest.mock('@/lib/fetchers');
jest.mock('@/access/authentication');

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
        expect(screen.getByAltText('user-solid')).toHaveAttribute('src', '/uhgroupings/user-solid.svg');
        expect(screen.getByLabelText('key-round')).toBeInTheDocument();
        expect(screen.getByTestId('welcome-message')).toHaveTextContent(`Welcome, ${User.firstName}!`);
        expect(screen.getByTestId('role')).toHaveTextContent(`Role: ${role}`);
    };

    const expectAdministration = (isAdmin: boolean) => {
        if (isAdmin) {
            expect(screen.getByRole('img', { name: 'key-solid' })).toHaveAttribute('src', '/uhgroupings/key-solid.svg');
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
            expect(screen.queryByRole('img', { name: 'key-solid' })).not.toBeInTheDocument();
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
        expect(screen.getByRole('img', { name: 'id-card' })).toHaveAttribute('src', '/uhgroupings/id-card-solid.svg');
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
            expect(screen.getByRole('img', { name: 'wrench-solid' })).toHaveAttribute(
                'src',
                '/uhgroupings/wrench-solid.svg'
            );
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
            expect(screen.queryByRole('img', { name: 'wrench-solid' })).not.toBeInTheDocument();
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
        jest.spyOn(Fetchers, 'getNumberOfGroupings').mockResolvedValue(numberOfGroupings);
        jest.spyOn(Fetchers, 'getNumberOfMemberships').mockResolvedValue(numberOfMemberships);
    });

    it('Should render correctly when logged in as an admin', async () => {
        jest.spyOn(Authentication, 'getCurrentUser').mockResolvedValue(admin);
        render(await afterLogin());
        expectWelcome(admin, 'Admin');
        expectAdministration(true);
        expectMemberships();
        expectGroupings(true, false);
    });

    it('Should render correctly when logged in as Owner', async () => {
        jest.spyOn(Authentication, 'getCurrentUser').mockResolvedValue(owner);
        render(await afterLogin());
        expectWelcome(owner, 'Owner');
        expectAdministration(false);
        expectMemberships();
        expectGroupings(false, true);
    });

    it('Should render correctly when logged in as a user with a UH account', async () => {
        jest.spyOn(Authentication, 'getCurrentUser').mockResolvedValue(uhUser);
        render(await afterLogin());
        expectWelcome(uhUser, 'Member');
        expectAdministration(false);
        expectMemberships();
        expectGroupings(false, false);
    });
});
