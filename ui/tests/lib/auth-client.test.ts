import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient, signInWithMicrosoft, signOutFromEntra } from '@/lib/auth-client';

const { signInSocial, signOut, createAuthClient } = vi.hoisted(() => ({
    signInSocial: vi.fn(),
    signOut: vi.fn(),
    createAuthClient: vi.fn(),
}));

vi.mock('better-auth/react', () => ({
    createAuthClient: createAuthClient.mockImplementation(() => ({ signIn: { social: signInSocial }, signOut })),
}));

describe('Better Auth client helpers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('window', { location: { origin: 'http://localhost:8080', assign: vi.fn() } });
    });

    afterEach(() => vi.unstubAllGlobals());

    it('uses no browser base URL while server-rendering', async () => {
        vi.resetModules();
        vi.stubGlobal('window', undefined);

        await import('@/lib/auth-client');

        expect(createAuthClient).toHaveBeenLastCalledWith({
            baseURL: undefined,
            sessionOptions: { refetchInterval: 300, refetchOnWindowFocus: true },
        });
    });

    it('starts Microsoft sign-in with a safe in-app callback URL', async () => {
        signInSocial.mockResolvedValue({ error: null });
        await signInWithMicrosoft('http://localhost:8080/uhgroupings/?callbackURL=%2Fuhgroupings%2Fadmin');

        expect(signInSocial).toHaveBeenCalledWith({ provider: 'microsoft', callbackURL: '/uhgroupings/admin' });
    });

    it('rejects a failed Microsoft sign-in without exposing provider details', async () => {
        signInSocial.mockResolvedValue({ error: { message: 'sensitive upstream value' } });
        await expect(signInWithMicrosoft('http://localhost:8080/uhgroupings/')).rejects.toThrow(
            'Microsoft sign-in could not be started. Please try again.'
        );
    });

    it('clears Better Auth before navigating to the server-side Entra logout route', async () => {
        signOut.mockResolvedValue({ error: null });
        await signOutFromEntra();

        expect(authClient.signOut).toHaveBeenCalledOnce();
        expect(window.location.assign).toHaveBeenCalledWith('/uhgroupings/api/entra/logout');
    });

    it('does not navigate to Entra when local Better Auth sign-out fails', async () => {
        signOut.mockResolvedValue({ error: { message: 'sensitive upstream value' } });
        await expect(signOutFromEntra()).rejects.toThrow('Sign-out could not be completed. Please try again.');
        expect(window.location.assign).not.toHaveBeenCalled();
    });
});
