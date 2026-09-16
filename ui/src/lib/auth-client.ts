'use client';

import { createAuthClient } from 'better-auth/react';
import { getLoginCallbackURL } from '@/lib/auth-navigation';
export const authClient = createAuthClient({
    baseURL: typeof window === 'undefined'
        ? undefined
        : new URL('/uhgroupings/api/auth', window.location.origin).toString(),
    sessionOptions: {
        refetchInterval: 300,
        refetchOnWindowFocus: true,
    },
});

export const signInWithMicrosoft = async (currentURL: string): Promise<void> => {
    const result = await authClient.signIn.social({
        provider: 'microsoft',
        callbackURL: getLoginCallbackURL(currentURL),
    });

    if (result.error) throw new Error('Microsoft sign-in could not be started. Please try again.');
};

/**
 * Clears the local Better Auth session before ending the Entra browser
 * session.
 */
export const signOutFromEntra = async (): Promise<void> => {
    // A callbackURL would navigate before the provider logout redirect below.
    const result = await authClient.signOut();
    if (result.error) throw new Error('Sign-out could not be completed. Please try again.');
    window.location.assign('/uhgroupings/api/entra/logout');
};
