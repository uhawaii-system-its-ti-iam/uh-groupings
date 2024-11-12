'use client';

import { Button } from '@/components/ui/button';
import Role from '@/lib/access/role';
import User from '@/lib/access/user';
import { login, logout } from 'next-cas-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const LoginButton = ({ currentUser }: { currentUser: User }) => (
    <>
        {!currentUser.roles.includes(Role.UH) ? (
            <Button variant="default" onClick={() => login()}>
                Login <FontAwesomeIcon className="ml-1" icon={faSignInAlt} />
            </Button>
        ) : (
            <Button variant="outline" onClick={() => logout()}>
                Logout&nbsp;
                <span className="sm:inline hidden">({currentUser.uid})</span>{' '}
                <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
            </Button>
        )}
    </>
);

export default LoginButton;
