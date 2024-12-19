import { describe, it, expect, beforeEach } from 'vitest';
import Role from '@/lib/access/role';
import User, { AnonymousUser } from '@/lib/access/user';
import NavbarMenu from '@/components/layout/navbar/navbar-menu';
import { fireEvent, render, screen } from '@testing-library/react';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('NavbarMenu', () => {
    it('should render the NavbarMenu with the sheet closed', () => {
        render(<NavbarMenu currentUser={AnonymousUser} />);

        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should open the drawer on click', () => {
        render(<NavbarMenu currentUser={AnonymousUser} />);

        fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    describe('User is logged-out', () => {
        it('should render the navbar with only the link to /about', () => {
            render(<NavbarMenu currentUser={AnonymousUser} />);

            fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Memberships' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.queryByRole('link', { name: 'Feedback' })).not.toBeInTheDocument();
        });
    });

    describe('User is logged-in', () => {
        beforeEach(() => {
            testUser.roles = [Role.ANONYMOUS];
        });

        it('should render only /memberships, /about, /feedback for the average user', () => {
            testUser.roles.push(Role.UH);
            render(<NavbarMenu currentUser={testUser} />);

            fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.queryByRole('link', { name: 'Groupings' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
        });

        it('should render only /memberships, /groupings, /about, /feedback for an owner of a grouping', () => {
            testUser.roles.push(Role.OWNER, Role.UH);
            render(<NavbarMenu currentUser={testUser} />);

            fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
        });

        it('should render all links for an Admin', () => {
            testUser.roles.push(Role.ADMIN, Role.UH);
            render(<NavbarMenu currentUser={testUser} />);

            fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
            expect(screen.getByRole('link', { name: 'Memberships' })).toHaveAttribute('href', '/memberships');
            expect(screen.getByRole('link', { name: 'Groupings' })).toHaveAttribute('href', '/groupings');
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
            expect(screen.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', '/feedback');
        });
    });
});
