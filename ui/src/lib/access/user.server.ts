import User, { AnonymousUser } from './user';

/**
 * Resolves the current user from Better Auth's session.
 *
 * This is intentionally separate from user.ts because user.ts is imported by
 * client components for the User type. Keeping the Better Auth import here
 * prevents Node-only Entra key handling from entering a client bundle.
 */
export async function getUser(): Promise<User> {
    // Keep request-only modules out of the server-action browser manifest.
    // This function itself runs only on the server when an action executes.
    const { headers } = await import('next/headers');
    const { auth } = await import('@/auth');
    const session = await auth.api.getSession({ headers: headers() });

    if (!session?.user) {
        return AnonymousUser;
    }

    const { uhUuid, uid, firstName, lastName, name } = session.user;

    if (!uhUuid || !uid) {
        return AnonymousUser;
    }

    return {
        name: name ?? '',
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        uid,
        uhUuid,
        roles: [],
    };
}
