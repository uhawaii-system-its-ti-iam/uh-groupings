import { getRequest, postRequestRetry } from './http-client';
import {
    Announcements,
    GroupingDescription,
    GroupingSyncDestinations,
    GroupingOptAttributes,
    GroupingGroupMembers,
    GroupingPaths,
    MembershipResults,
    GroupingGroupsMembers
} from './types';
import { getUser } from '@/lib/access/user';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

/**
 * Get a list of announcements to display on the home page.
 *
 * @returns The promise of announcements
 */
export const getAnnouncements = (): Promise<Announcements> => {
    const endpoint = `${baseUrl}/announcements`;
    return getRequest<Announcements>(endpoint);
};

/**
 * Get all the members of an owned grouping through paginated calls.
 *
 * @param groupPaths - The paths to the groups
 * @param page - The page number
 * @param size - The size of the page
 * @param sortString - String to sort by column name
 * @param isAscending - On true the data returns in ascending order
 *
 * @returns The promise of members of an owned grouping
 */
export const ownedGrouping = async (
    groupPaths: string[],
    page: number,
    size: number,
    sortString: string,
    isAscending: boolean
): Promise<GroupingGroupsMembers> => {
    const currentUser = await getUser();
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortString,
        isAscending: isAscending.toString()
    });
    const endpoint = `${baseUrl}/groupings/group?${params.toString()}`;
    return postRequestRetry<GroupingGroupsMembers>(endpoint, currentUser.uid, groupPaths);
};

/**
 * Get the description of a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping description
 */
export const groupingDescription = async (groupingPath: string): Promise<GroupingDescription> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return getRequest<GroupingDescription>(endpoint, currentUser.uid);
};

/**
 * Get the sync destinations of a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping sync destinations
 */
export const groupingSyncDest = async (groupingPath: string): Promise<GroupingSyncDestinations> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`;
    return getRequest<GroupingSyncDestinations>(endpoint, currentUser.uid);
};

/**
 * Get the opt attributes of a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping opt attributes
 */
export const groupingOptAttributes = async (groupingPath: string): Promise<GroupingOptAttributes> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/opt-attributes`;
    return getRequest<GroupingOptAttributes>(endpoint, currentUser.uid);
};

/**
 * Get a list of admins.
 *
 * @returns The promise of the grouping admins
 */
export const groupingAdmins = async (): Promise<GroupingGroupMembers> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/admins`;
    return getRequest<GroupingGroupMembers>(endpoint, currentUser.uid);
};

/**
 * Get a list of all grouping paths.
 *
 * @returns The promise of all the grouping paths
 */
export const getAllGroupings = async (): Promise<GroupingPaths> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
};

/**
 * Get a list of memberships that the current user is associated with.
 *
 * @returns The promise of the membership results
 */
export const membershipResults = async (): Promise<MembershipResults> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/members/${currentUser.uid}/memberships`;
    return getRequest<MembershipResults>(endpoint, currentUser.uid);
};

/**
 * Get a list of all groupings that a user is associated with.
 *
 * @param uhIdentifier - The uhIdentifier to search in Manage Person
 *
 * @returns The promise of the membership results
 */
export const managePersonResults = async (uhIdentifier: string): Promise<MembershipResults> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/members/${uhIdentifier}/groupings`;
    return getRequest<MembershipResults>(endpoint, currentUser.uid);
};

/**
 * Get the number of memberships the current user has
 *
 * @returns The promise of the number of memberships
 */
export const getNumberOfMemberships = async (): Promise<number> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/members/${currentUser.uid}/memberships/count`;
    return getRequest<number>(endpoint, currentUser.uid);
};

/**
 * Get a list of grouping paths that the current user can opt into.
 *
 * @returns The promise of the grouping paths
 */
export const optInGroupingPaths = async (): Promise<GroupingPaths> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
};

/**
 * Get a list of owners in the current path.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping group members
 */
export const groupingOwners = async (groupingPath: string): Promise<GroupingGroupMembers> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/grouping/${groupingPath}/owners`;
    return getRequest<GroupingGroupMembers>(endpoint, currentUser.uid);
};

/**
 * Get the groupings the current user owns.
 *
 * @returns The promise of the grouping paths
 */
export const ownerGroupings = async (): Promise<GroupingPaths> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
};

/**
 * Get the number of groupings the current user owns.
 *
 * @returns The promise of the number of groupings
 */
export const getNumberOfGroupings = async (): Promise<number> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings/count`;
    return getRequest<number>(endpoint, currentUser.uid);
};

/**
 * Checks if the owner of a grouping is the sole owner.
 *
 * @param uhIdentifier - The uhIdentifier to check
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of true if uhIdentifier is the sole owner of a grouping
 */
export const isSoleOwner = async (uhIdentifier: string, groupingPath: string): Promise<boolean> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`;
    return getRequest<boolean>(endpoint, currentUser.uid);
};

/**
 * Check if the uhIdentifier is an owner.
 *
 * @param uhIdentifier - The uid or uhUuid
 *
 * @returns True if the uhIdentifier is an owner of a grouping
 */
export const isOwner = async (uhIdentifier: string): Promise<boolean> => {
    const endpoint = `${baseUrl}/owners`;
    return getRequest<boolean>(endpoint, uhIdentifier);
};

/**
 * Check if the uhIdentifier is an admin.
 *
 * @param uhIdentifier - The uid or uhUuid
 *
 * @returns True if the uhIdentifier is an admin
 */
export const isAdmin = async (uhIdentifier: string): Promise<boolean> => {
    const endpoint = `${baseUrl}/admins`;
    return getRequest<boolean>(endpoint, uhIdentifier);
};
