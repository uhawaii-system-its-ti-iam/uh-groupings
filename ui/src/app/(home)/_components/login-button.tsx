'use client';

import { Button } from '@/components/ui/button';
import Role from '@/lib/access/role';
import { login, logout } from 'next-cas-client';
import User from '@/lib/access/user';

const LoginButton = ({ currentUser }: { currentUser: User }) => (
    <>
        {!currentUser?.roles.includes(Role.UH) ? (
            <Button size="lg" variant="default" onClick={() => login()}>
                Login Here
            </Button>
        ) : (
            <Button size="lg" variant="default" onClick={() => logout()}>
                Logout
            </Button>
        )}
    </>
);

export default LoginButton;
