'use client';

import { Button } from '@/components/ui/button';
import Role from '@/access/role';
import User from '@/access/user';
import { login, logout } from '@/access/authentication';
import { LogInIcon, LogOutIcon } from 'lucide-react';

const LoginButton = ({ 
    currentUser 
}: {
    currentUser: User;
}) => (
    <>
        {!currentUser.roles.includes(Role.UH) ? (
            <Button 
                variant="default" 
                onClick={() => login()}>
                Login <LogInIcon className="ml-1" />
            </Button>
        ) : (
            <Button 
                variant="outline" 
                onClick={() => logout()}>
                Logout&nbsp;
                <span className="sm:inline hidden">({currentUser.uid})</span> <LogOutIcon className="ml-1" />
            </Button>
        )}
    </> 
);

export default LoginButton;
