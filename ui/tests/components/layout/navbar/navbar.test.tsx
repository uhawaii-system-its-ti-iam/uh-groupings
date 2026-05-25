import { vi, describe, it, expect, beforeEach } from 'vitest';
import User, { AnonymousUser } from '@/lib/access/user';
import * as NextCasClient from 'next-cas-client/app';
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/layout/navbar/navbar';
import Role from '@/lib/access/role';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');

describe('Navbar', () => {
    describe('User is logged-out', () => {
        it('should render the navbar with only the link to /about', async () => {
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(AnonymousUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0]).toHaveAttribute(
                'src',
                '/uhgroupings/uh-groupings-logo.svg'
            );
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
        });

        it('should render only /memberships, /about, /feedback for the average user', async () => {
            testUser.roles.push(Role.UH);
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0]).toHaveAttribute(
                'src',
                '/uhgroupings/uh-groupings-logo.svg'
            );
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
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0]).toHaveAttribute(
                'src',
                '/uhgroupings/uh-groupings-logo.svg'
            );
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
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0]).toHaveAttribute(
                'src',
                '/uhgroupings/uh-groupings-logo.svg'
            );
            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument();
        });

        it('should render the departmental icon for a Departmental Account without Admin or Groupings links', async () => {
            testUser.roles.push(Role.DEPARTMENTAL, Role.UH);
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
            render(await Navbar());

            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'UH Groupings Logo' })[0]).toHaveAttribute(
                'src',
                '/uhgroupings/uh-groupings-logo.svg'
            );

            expect(screen.getAllByRole('link', { name: 'UH Groupings Logo' })[0]).toHaveAttribute('href', '/');
            expect(screen.getByLabelText('Departmental Account Icon')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument();
        });
    });
});
