import User, { AnonymousUser } from '@/access/User';
import * as AuthenticationService from '@/access/AuthenticationService';
import { render, screen } from '@testing-library/react';
import Navbar from '@/app/_components/layout/navbar/Navbar';
import Role from '@/access/Role';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

jest.mock('@/access/AuthenticationService');

describe('Navbar', () => {

    describe('User is logged-out', () => {

        it('should render the navbar with only the link to /about', async () => {
            jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(AnonymousUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0])
                .toHaveAttribute('src', '/uhgroupings/uh-groupings-logo.svg');
            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Memberships' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.queryByRole('link', { name: 'Feedback' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        });

    });

    describe('User is logged-in', () => {

        beforeEach(() => {
            testUser.roles = [Role.ANONYMOUS];
        })

        it('should render only /memberships, /about, /feedback for the average user', async () => {
            testUser.roles.push(Role.UH);
            jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0])
                .toHaveAttribute('src', '/uhgroupings/uh-groupings-logo.svg');
            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.queryByRole('link', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument();
        });

        it('should render only /memberships, /groupings, /about, /feedback for an owner of a grouping', async () => {
            testUser.roles.push(Role.OWNER, Role.UH);
            jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0])
                .toHaveAttribute('src', '/uhgroupings/uh-groupings-logo.svg');
            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument();
        });

        it('should render all links for an Admin', async () => {
            testUser.roles.push(Role.ADMIN, Role.UH);
            jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0])
                .toHaveAttribute('src', '/uhgroupings/uh-groupings-logo.svg');
            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument();
        });

    });

});
