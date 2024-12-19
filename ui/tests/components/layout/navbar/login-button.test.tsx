import { vi, describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/layout/navbar/login-button';
import User, { AnonymousUser } from '@/lib/access/user';
import Role from '@/lib/access/role';
import * as NextCasClient from 'next-cas-client';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client');

describe('Login', () => {
    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<Login currentUser={AnonymousUser} />);

            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        });

        it('should visit the CAS login url on click', async () => {
            render(<Login currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login' }));
            expect(NextCasClient.login).toHaveBeenCalled();
        });
    });

    describe('User is logged in', () => {
        beforeAll(() => {
            testUser.roles.push(Role.UH);
        });

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<Login currentUser={testUser} />);

            expect(screen.getByRole('button', { name: `Logout (${testUser.uid})` })).toBeInTheDocument;
        });

        it('should visit the CAS logout url on click', async () => {
            render(<Login currentUser={testUser} />);

            await userEvent.click(screen.getByRole('button', { name: `Logout (${testUser.uid})` }));
            expect(NextCasClient.logout).toHaveBeenCalled();
        });
    });
});
