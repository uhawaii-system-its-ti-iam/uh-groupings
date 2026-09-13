import { isOwner, isAdmin } from '../fetchers';
import Role from './role';
import User from './user';

/**
 * Sets the appropriate roles for a user.
 *
 * @param user - The user
 */
export const setRoles = async (user: User): Promise<User> => {
    // All users should have ANONYMOUS role to describe universal access (e.g. /about page in NavLinks.ts)
    if (!user.roles.includes(Role.ANONYMOUS)) {
        user.roles.push(Role.ANONYMOUS);
    }

    if (!isValidUhUuid(user.uhUuid)) {
        // An anonymous/unenriched session has no identity to authorize.
        // In particular, do not issue owner/admin API requests with an empty
        // identifier while rendering the public home page.
        return user;
    }

    if (!user.roles.includes(Role.UH)) user.roles.push(Role.UH);

    const [isUserOwner, isUserAdmin] = await Promise.all([
        user.roles.includes(Role.OWNER) ? Promise.resolve(true) : isOwner(user.uhUuid, user),
        user.roles.includes(Role.ADMIN) ? Promise.resolve(true) : isAdmin(user.uhUuid, user)
    ]);

    if (isUserOwner) {
        if (!user.roles.includes(Role.OWNER)) user.roles.push(Role.OWNER);
    }
    if (isUserAdmin) {
        if (!user.roles.includes(Role.ADMIN)) user.roles.push(Role.ADMIN);
    }
    if (isDepartmental(user.uid, user.uhUuid)) {
        if (!user.roles.includes(Role.DEPARTMENTAL)) user.roles.push(Role.DEPARTMENTAL);
    }

    return user;
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
