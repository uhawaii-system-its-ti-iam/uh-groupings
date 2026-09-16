import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/layout/navbar/login-button';
import User, { AnonymousUser } from '@/lib/access/user';
import Role from '@/lib/access/role';
import { signInWithMicrosoft, signOutFromEntra } from '@/lib/auth-client';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('@/lib/auth-client', () => ({
    signInWithMicrosoft: vi.fn(),
    signOutFromEntra: vi.fn(),
}));

describe('Login', () => {
    beforeEach(() => vi.clearAllMocks());
    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<Login currentUser={AnonymousUser} />);

            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        });

        it('starts Better Auth Microsoft sign-in with the current URL', async () => {
            render(<Login currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login' }));
            expect(signInWithMicrosoft).toHaveBeenCalledWith(window.location.href);
        });

        it('shows a safe error if Better Auth cannot start Microsoft login', async () => {
            vi.mocked(signInWithMicrosoft).mockRejectedValueOnce(new Error('provider unavailable'));
            render(<Login currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login' }));
            expect(await screen.findByRole('alert')).toHaveTextContent('Microsoft sign-in could not be started. Please try again.');
        });
    });

    describe('User is logged in', () => {
        const signedInUser: User = { ...testUser, roles: [Role.UH] };

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<Login currentUser={signedInUser} />);

            expect(screen.getByRole('button', { name: `Logout (${signedInUser.uid})` })).toBeInTheDocument();
        });

        it('clears the Better Auth session before Entra logout', async () => {
            render(<Login currentUser={signedInUser} />);

            await userEvent.click(screen.getByRole('button', { name: `Logout (${signedInUser.uid})` }));
            expect(signOutFromEntra).toHaveBeenCalledOnce();
        });

        it('shows a safe error if Better Auth or Entra logout fails', async () => {
            vi.mocked(signOutFromEntra).mockRejectedValueOnce(new Error('logout failed'));
            render(<Login currentUser={signedInUser} />);

            await userEvent.click(screen.getByRole('button', { name: `Logout (${signedInUser.uid})` }));
            expect(await screen.findByRole('alert')).toHaveTextContent('Sign-out could not be completed. Please try again.');
        });
    });
});
