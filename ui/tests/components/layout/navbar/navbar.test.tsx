import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/layout/navbar/navbar';
import Role from '@/lib/access/role';
import userEvent from '@testing-library/user-event';

const logoutMock = vi.fn();
vi.mock('@/components/hook/useBlockNavigation.tsx', () => ({
    __esModule: true,
    default: () => ({
        logoutWithBlock: logoutMock,
        setIsApiPending: vi.fn(),
    }),
}));

const mockUser = { uid: 'test123', roles: [] };

vi.mock('@/lib/access/user', () => ({
    __esModule: true,
    getUser: () => mockUser,
    AnonymousUser: { uid: '', roles: [] }
}));

vi.mock('next-cas-client/app');

describe('Navbar', () => {
    beforeEach(() => {
        mockUser.roles = [];
        logoutMock.mockClear();
    });

    it('renders Login button when logged out', async () => {
        mockUser.roles = [];
        render(await Navbar());
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders Logout button when logged in', async () => {
        mockUser.roles = [Role.UH];
        render(await Navbar());
        expect(
            screen.getByRole('button', { name: `Logout (${mockUser.uid})` })
        ).toBeInTheDocument();
    });

    it('calls logoutWithBlock when logout clicked', async () => {
        mockUser.roles = [Role.UH];
        render(await Navbar());
        await userEvent.click(
            screen.getByRole('button', { name: `Logout (${mockUser.uid})` })
        );
        expect(logoutMock).toHaveBeenCalled();
    });

    it('renders correct links for UH user', async () => {
        mockUser.roles = [Role.UH];
        render(await Navbar());
        await userEvent.click(screen.getByLabelText('Open navigation menu'));
        expect(screen.getByRole('link', { name: 'Memberships' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Feedback' })).toBeInTheDocument();
    });


    it('renders Admin link for Admin user', async () => {
        mockUser.roles = [Role.UH, Role.ADMIN];
        render(await Navbar());
        expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
    });
});
