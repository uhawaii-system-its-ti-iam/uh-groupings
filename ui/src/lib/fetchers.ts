import { getRequest } from './http-client';
import {
    Announcements,
    GroupingDescription,
    GroupingSyncDestinations,
    GroupingOptAttributes,
    GroupingGroupMembers,
    GroupingPaths,
    MembershipResults
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
    const endpoint = `${baseUrl}/members/${uhIdentifier}/is-owner`;
    return getRequest<boolean>(endpoint, uhIdentifier);
};

/**
 * Check if the uhIdentifier is an owner of the grouping.
 *
 * @param groupingPath - The path of the grouping
 * @param uhIdentifier - The uid or uhUuid
 *
 * @returns True if the uhIdentifier is an owner of a grouping
 */
export const isGroupingOwner = async (groupingPath: string, uhIdentifier: string): Promise<boolean> => {
    const endpoint = `${baseUrl}/members/${groupingPath}/${uhIdentifier}/is-owner`;
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
    const endpoint = `${baseUrl}/members/${uhIdentifier}/is-admin`;
    return getRequest<boolean>(endpoint, uhIdentifier);
};

/**
 * Check if the path of the grouping is valid.
 *
 * @param uhIdentifier - The uid or uhUuid
 *
 * @returns True if the path of the grouping is valid.
 */
export const groupingPathIsValid = async (groupingPath: string): Promise<boolean> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/grouping/${groupingPath}/is-valid`;
    return getRequest<boolean>(endpoint, currentUser.uid);
};
