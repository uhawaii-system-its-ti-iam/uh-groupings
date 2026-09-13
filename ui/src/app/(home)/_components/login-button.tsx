'use client';

import { Button } from '@/components/ui/button';
import Role from '@/lib/access/role';
import { signInWithMicrosoft, signOutFromEntra } from '@/lib/auth-client';
import User from '@/lib/access/user';
import { useState } from 'react';

const LoginButton = ({ currentUser }: { currentUser: User }) => {
    const [error, setError] = useState<string>();
    const handleLogin = async () => {
        setError(undefined);
        try { await signInWithMicrosoft(window.location.href); }
        catch { setError('Microsoft sign-in could not be started. Please try again.'); }
    };
    const handleLogout = async () => {
        setError(undefined);
        try { await signOutFromEntra(); }
        catch { setError('Sign-out could not be completed. Please try again.'); }
    };

    return <>
        {!currentUser?.roles.includes(Role.UH) ? (
            <Button size="lg" variant="default" onClick={handleLogin}>
                Login Here
            </Button>
        ) : (
            <Button size="lg" variant="default" onClick={handleLogout}>
                Logout
            </Button>
        )}
        {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
    </>
};

export default LoginButton;
