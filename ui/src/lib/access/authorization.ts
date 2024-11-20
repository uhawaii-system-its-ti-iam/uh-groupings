import { isOwner, isAdmin } from '../fetchers';
import Role from './role';
import User from './user';

/**
 * Sets the appropriate roles for a user.
 *
 * @param user - The user
 */
export const setRoles = async (user: User): Promise<void> => {
    // All users should have ANONYMOUS role to describe universal access (e.g. /about page in NavLinks.ts)
    user.roles.push(Role.ANONYMOUS);

    if (isValidUhUuid(user.uhUuid)) {
        user.roles.push(Role.UH);
    }
    if (await isOwner(user.uhUuid)) {
        user.roles.push(Role.OWNER);
    }
    if (await isAdmin(user.uhUuid)) {
        user.roles.push(Role.ADMIN);
    }
    if (isDepartmental(user.uid, user.uhUuid)) {
        user.roles.push(Role.DEPARTMENTAL);
    }
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
