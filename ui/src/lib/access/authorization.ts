import { isOwner, isAdmin } from '../fetchers';
import Role from './role';
import User from './user';
import { unstable_cache } from 'next/cache';

const getRemoteRoles = (user: User) =>
    unstable_cache(
        async (): Promise<Role[]> => {
            const [owner, admin] = await Promise.all([isOwner(user.uhUuid, user), isAdmin(user.uhUuid, user)]);
            return [owner && Role.OWNER, admin && Role.ADMIN].filter(Boolean) as Role[];
        },
        ['user-authorization', user.uid],
        { revalidate: 60, tags: [`user-authorization:${user.uid}`] }
    )();

/**
 * Sets the appropriate roles for a user.
 *
 * @param user - The user
 */
export const setRoles = async (user: User): Promise<User> => {
    const roles = new Set(user.roles);
    roles.add(Role.ANONYMOUS);

    if (!user.uid || !isValidUhUuid(user.uhUuid)) {
        return { ...user, roles: [...roles] };
    }

    roles.add(Role.UH);

    for (const role of await getRemoteRoles(user)) roles.add(role);
    if (isDepartmental(user.uid, user.uhUuid)) {
        roles.add(Role.DEPARTMENTAL);
    }

    return { ...user, roles: [...roles] };
};

/**
 * Checks if uhUuid is valid using Regex.
 *
 * @param uhUuid - 8 digit unique user indentifier
 *
 * @returns True if uhUuid is valid
 */
const isValidUhUuid = (uhUuid: string): boolean => {
    const uhUuidPattern = new RegExp(/^[0-9]{8}$/);
    return uhUuidPattern.test(uhUuid);
};

/**
 * Checks if user is a Departmental account.
 *
 * @param uid - The username
 * @param uhUuid - 8 digit unique user indentifier
 *
 * @returns True if user is a departmental account
 */
export const isDepartmental = (uid: string, uhUuid: string): boolean => {
    return uid === uhUuid || !uhUuid;
};
