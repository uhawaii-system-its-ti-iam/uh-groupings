import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import User, { AnonymousUser } from '@/lib/access/user';
import Role from '@/lib/access/role';
import LoginButton from '@/app/(home)/_components/login-button';
import { signInWithMicrosoft, signOutFromEntra } from '@/lib/auth-client';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('@/lib/auth-client', () => ({
    signInWithMicrosoft: vi.fn(),
    signOutFromEntra: vi.fn(),
}));

describe('LoginButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('User is not logged in', () => {
        it('should render a Login button', () => {
            render(<LoginButton currentUser={AnonymousUser} />);

            expect(screen.getByRole('button', { name: 'Login Here' })).toBeInTheDocument();
        });

        it('starts Better Auth Microsoft sign-in with the current URL', async () => {
            render(<LoginButton currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login Here' }));
            expect(signInWithMicrosoft).toHaveBeenCalledWith(window.location.href);
        });

        it('shows a safe message when Microsoft sign-in cannot start', async () => {
            vi.mocked(signInWithMicrosoft).mockRejectedValueOnce(new Error('provider unavailable'));
            render(<LoginButton currentUser={AnonymousUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Login Here' }));
            expect(await screen.findByRole('alert')).toHaveTextContent('Microsoft sign-in could not be started. Please try again.');
        });
    });

    describe('User is logged in', () => {
        const signedInUser: User = { ...testUser, roles: [Role.UH] };

        it('should render a Logout button with the uid of the logged-in user', () => {
            render(<LoginButton currentUser={signedInUser} />);

            expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
        });

        it('clears Better Auth and then starts Entra logout on click', async () => {
            render(<LoginButton currentUser={signedInUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
            expect(signOutFromEntra).toHaveBeenCalledOnce();
        });

        it('shows a safe message when local or Entra logout fails', async () => {
            vi.mocked(signOutFromEntra).mockRejectedValueOnce(new Error('logout failed'));
            render(<LoginButton currentUser={signedInUser} />);

            await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
            expect(await screen.findByRole('alert')).toHaveTextContent('Sign-out could not be completed. Please try again.');
        });
    });
});
