'use client';

import { Button } from '@/components/ui/button';
import Role from '@/access/role';
import User from '@/access/user';
import { login, logout } from '@/access/authentication';

const LoginButton = ({
    currentUser
}: {
    currentUser: User;
}) => (
    <>
        {!currentUser.roles.includes(Role.UH) ? (
            <Button
                size="lg"
                variant="default"
                onClick={() => login()}>
                Login Here
            </Button>
        ) : (
            <Button
                size="lg"
                variant="default"
                onClick={() => logout()}>
                Logout
            </Button>
        )}
    </>
);

export default LoginButton;
