'use client';

import { Button } from '@/components/ui/button';
import Role from '@/lib/access/role';
import { login, logout } from 'next-cas-client';
import User from '@/lib/access/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const LoginButton = ({ currentUser }: { currentUser: User }) => {
    const isOotbMode = process.env.NEXT_PUBLIC_OOTB_MODE === 'true';

    return (
        <>
            {!currentUser?.roles.includes(Role.UH) && !isOotbMode ? (
                <Button size="lg" variant="default" onClick={() => login()}>
                    Login <FontAwesomeIcon className="ml-1" icon={faSignInAlt} />
                </Button>
            ) : (
                <Button size="lg" variant="default" onClick={() => logout()} disabled={isOotbMode}>
                    Logout&nbsp;
                    <span className="sm:inline hidden">({currentUser.uid})</span>{' '}
                    <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
                </Button>
            )}
        </>
    );
};

export default LoginButton;
