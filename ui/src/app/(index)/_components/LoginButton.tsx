'use client';
import { Button } from '@/components/ui/button';
import Role from '@/access/Role';
import User from '@/access/User';
import { login, logout } from '@/access/AuthenticationService';

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
