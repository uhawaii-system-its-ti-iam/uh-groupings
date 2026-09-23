import User, { AnonymousUser } from './user';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { cache } from 'react';

/**
 * Resolves the current application user from the Better Auth session.
 * React cache() memoizes this for the lifetime of the current server request.
 */
export const getUser = cache(async (): Promise<User> => {
    // Keep request-only modules out of the server-action browser manifest.
    // This function itself runs only on the server when an action executes.
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return { ...AnonymousUser, roles: [...AnonymousUser.roles] };
    }

    const { uhUuid, uid, firstName, lastName, name } = session.user;

    if (!uhUuid || !uid) {
        return { ...AnonymousUser, roles: [...AnonymousUser.roles] };
    }

    return {
        name: name ?? '',
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        uid,
        uhUuid,
        roles: []
    };
});

/**
 * Resolves the current user and application roles once per server request.
 */
export const getAuthorizedUser = cache(async (): Promise<User> => {
    const user = await getUser();
    const { setRoles } = await import('./authorization');
    return setRoles(user);
});
