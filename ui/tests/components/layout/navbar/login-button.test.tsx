import { vi, describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/layout/navbar/login-button';
import User, { AnonymousUser } from '@/lib/access/user';
import Role from '@/lib/access/role';
import * as NextCasClient from 'next-cas-client';

vi.mock('next-cas-client');

const logoutWithBlockMock = vi.fn();
vi.mock('@/components/hook/useBlockNavigation.tsx', () => ({
    __esModule: true,
    default: () => ({
        logoutWithBlock: logoutWithBlockMock,
        setIsApiPending: vi.fn(),
    }),
}));

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('Login', () => {
    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<Login currentUser={AnonymousUser} />);
            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        });

        it('should call CAS login on click', async () => {
            render(<Login currentUser={AnonymousUser} />);
            await userEvent.click(screen.getByRole('button', { name: 'Login' }));
            expect(NextCasClient.login).toHaveBeenCalled();
        });
    });

    describe('User is logged in', () => {
        beforeAll(() => {
            testUser.roles.push(Role.UH);
        });

        it('should render a Logout button with the uid', () => {
            render(<Login currentUser={testUser} />);
            expect(
                screen.getByRole('button', { name: `Logout (${testUser.uid})` })
            ).toBeInTheDocument();
        });

        it('should call logoutWithBlock instead of CAS logout', async () => {
            render(<Login currentUser={testUser} />);
            await userEvent.click(
                screen.getByRole('button', { name: `Logout (${testUser.uid})` })
            );
            expect(logoutWithBlockMock).toHaveBeenCalled();
            expect(NextCasClient.logout).not.toHaveBeenCalled();
        });
    });
});
