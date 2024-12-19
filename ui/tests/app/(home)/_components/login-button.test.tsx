import { vi, describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import User, { AnonymousUser } from '@/lib/access/user';
import Role from '@/lib/access/role';
import LoginButton from '@/app/(home)/_components/login-button';
import * as NextCasClient from 'next-cas-client';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client');

describe('LoginButton', () => {
    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<LoginButton currentUser={AnonymousUser} />);

            expect(screen.getByRole('button', { name: 'Login Here' })).toBeInTheDocument();
        });

        it('should visit the CAS login url on click', async () => {
            render(<LoginButton currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login Here' }));
            expect(NextCasClient.login).toHaveBeenCalled();
        });
    });

    describe('User is logged in', () => {
        beforeAll(() => {
            testUser.roles.push(Role.UH);
        });

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<LoginButton currentUser={testUser} />);

            expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
        });

        it('should visit the CAS logout url on click', async () => {
            render(<LoginButton currentUser={testUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
            expect(NextCasClient.logout).toHaveBeenCalled();
        });
    });
});
