'use client';

import { Button } from '@/components/ui/button';
import Role from '@/lib/access/role';
import User from '@/lib/access/user';
import { signInWithMicrosoft, signOutFromEntra } from '@/lib/auth-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
        {!currentUser.roles.includes(Role.UH) ? (
            <Button variant="default" onClick={handleLogin}>
                Login <FontAwesomeIcon className="ml-1" icon={faSignInAlt} />
            </Button>
        ) : (
            <Button variant="outline" onClick={handleLogout}>
                Logout&nbsp;
                <span className="sm:inline hidden">({currentUser.uid})</span>{' '}
                <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
            </Button>
        )}
        {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
    </>
};

export default LoginButton;
