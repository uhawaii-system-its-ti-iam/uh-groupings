'use server';

import { getCurrentUser } from '@/access/AuthenticationService';
import { 
    Announcements,
    ApiError, 
    GroupingAddResult, 
    GroupingAddResults, 
    GroupingDescription, 
    GroupingGroupMembers, 
    GroupingGroupsMembers,
    GroupingMoveMemberResult,
    GroupingMoveMembersResult,
    GroupingOptAttributes,
    GroupingPaths,
    GroupingRemoveResult,
    GroupingRemoveResults,
    GroupingSyncDestinations, 
    GroupingUpdateDescriptionResult,
    MemberAttributeResults,
    MembershipResults
} from '../groupings/GroupingsApiResults';
import { 
    deleteRequest,
    deleteRequestAsync,
    getRequest, 
    postRequest, 
    postRequestAsync, 
    postRequestRetry, 
    putRequest, 
    putRequestAsync 
} from './FetchService';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

// TODO: 
// The setOptIn, setOptOut, setSyncDest service functions will be up to the person who works on 
// implementing Opt Attributes and Sync Desinations into our React UI.

/**
 * Get a list of announcements to display on the home page.
 * 
 * @returns The promise of announcements or ApiError type
 */
export const getAnnouncements = (): Promise<Announcements> => {
    const endpoint = `${baseUrl}/announcements`;
    return getRequest<Announcements>(endpoint);
}

/**
 * Get all the members of an owned grouping through paginated calls.
 * 
 * @param groupPaths - The paths to the groups
 * @param page - The page number
 * @param size - The size of the page
 * @param sortString - String to sort by column name
 * @param isAscending - On true the data returns in ascending order
 * 
 * @returns The promise of members of an owned grouping or ApiError type
 */
export const ownedGrouping = async (
    groupPaths: string[],
    page: number,
    size: number,
    sortString: string,
    isAscending: boolean
): Promise<GroupingGroupsMembers & ApiError> => {
    const currentUser = await getCurrentUser();
    const params = new URLSearchParams({ 
        page: page.toString(), 
        size: size.toString(), 
        sortString, 
        isAscending: isAscending.toString() 
    });
    const endpoint = `${baseUrl}/groupings/group?${params.toString()}`;
    return postRequestRetry<GroupingGroupsMembers>(endpoint, currentUser.uid, groupPaths);
}

/**
 * Get the description of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping description or ApiError type
 */
export const groupingDescription = async (
    groupingPath: string
): Promise<GroupingDescription & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return getRequest<GroupingDescription>(endpoint, currentUser.uid);
}

/**
 * Get the sync destinations of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping sync destinations or ApiError type
 */
export const groupingSyncDest = async (
    groupingPath: string
): Promise<GroupingSyncDestinations & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`;
    return getRequest<GroupingSyncDestinations>(endpoint, currentUser.uid);
}

/**
 * Get the opt attributes of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping opt attributes or ApiError type
 */
export const groupingOptAttributes = async (
    groupingPath: string
): Promise<GroupingOptAttributes & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/opt-attributes`;
    return getRequest<GroupingOptAttributes>(endpoint, currentUser.uid)
}

/**
 * Update the description of grouping at path.
 * 
 * @param description - The new description
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the result of updating the description or ApiError type
 */
export const updateDescription = async (
    description: string,
    groupingPath: string
): Promise<GroupingUpdateDescriptionResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return postRequest<GroupingUpdateDescriptionResult>(endpoint, currentUser.uid, description);
}

/**
 * Get a list of admins.
 * 
 * @returns The promise of the grouping admins or ApiError type
 */
export const groupingAdmins = async (): Promise<GroupingGroupMembers & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/grouping-admins`;
    return getRequest<GroupingGroupMembers>(endpoint, currentUser.uid);
}

/**
 * Get a list of all grouping paths.
 * 
 * @returns The promise of all the grouping paths or ApiError type
 */
export const getAllGroupings = async (): Promise<GroupingPaths & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/all-groupings`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
}

/**
 * Add members to the include group of a grouping.
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const addIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return putRequest<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Add members to the include group of a grouping asynchronously using polling. 
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to include
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const addIncludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/async`;
    return putRequestAsync<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Add members to the exclude group of a grouping.
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const addExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return putRequest<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Add members to the exclude group of a grouping asynchronously using polling. 
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const addExcludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/async`;
    return putRequestAsync<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Add an owner to the owners group of a grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to add to owners
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping add results or ApiError type
 */
export const addOwners = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingAddResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return postRequest<GroupingAddResults>(endpoint, currentUser.uid);
}

/**
 * Add an admin to the UH Groupings admins.
 * 
 * @param uhIdentifier - The uhIdentifier to add to admins
 * 
 * @returns The promise of the grouping add results or ApiError type
 */
export const addAdmin = async (
    uhIdentifier: string
): Promise<GroupingAddResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return postRequest<GroupingAddResult>(endpoint, currentUser.uid);
}

/**
 * Remove a uhIdentifier from multiple groupings.
 * 
 * @param uhIdentifier - The uhIdentifier to remove from groups
 * @param groupPaths - The paths to the groups to remove from
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const removeFromGroups = async (
    uhIdentifier: string,
    groupPaths: string[],
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${groupPaths}/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
}

/**
 * Remove members from include group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from the include
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const removeIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Remove members from exclude group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from the exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const removeExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Remove owners from owners group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from owners
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const removeOwners = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
}

/**
 * Remove an admin from the UH Groupings admins.
 * 
 * @param uhIdentifier - The uhIdentifier to remove from admins
 * 
 * @returns The promise of the grouping remove result or ApiError type
 */
export const removeAdmin = async (
    uhIdentifier: string
): Promise<GroupingRemoveResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResult>(endpoint, currentUser.uid);
}

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName.
 * 
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 * 
 * @returns The promise of the member attribute results or ApiError type
 */
export const memberAttributeResults = async (
    uhIdentifiers: string[]
): Promise<MemberAttributeResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members`;
    return postRequest<MemberAttributeResults>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName 
 * asynchronously using polling.
 * 
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 * 
 * @returns The promise of the member attribute results or ApiError type
 */ 
export const memberAttributeResultsAsync = async (
    uhIdentifiers: string[]
): Promise<MemberAttributeResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/async`;
    return postRequestAsync<MemberAttributeResults>(endpoint, currentUser.uid, uhIdentifiers);
}

/**
 * Opt a user into a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const optIn = async (
    groupingPath: string
): Promise<GroupingMoveMemberResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
}

/**
 * Opt a member out of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping move member result or ApiError type
 */
export const optOut = async (
    groupingPath: string
): Promise<GroupingMoveMemberResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
}

/**
 * Get a list of memberships that the current user is associated with.
 * 
 * @returns The promise of the membership results or ApiError type
 */
export const membershipResults = async (): Promise<MembershipResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/${currentUser.uid}/memberships`;
    return getRequest<MembershipResults>(endpoint, currentUser.uid);
}

/**
 * Get a list of all groupings that a user is associated with.
 * 
 * @param uhIdentifier - The uhIdentifier to search in Manage Person
 * 
 * @returns The promise of the membership results or ApiError type
 */
export const managePersonResults = async (
    uhIdentifier: string
): Promise<MembershipResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/${uhIdentifier}/groupings`;
    return getRequest<MembershipResults>(endpoint, currentUser.uid);
}

/**
 * Get the number of memberships the current user has
 * 
 * @returns The promise of the number of memberships or ApiError type
 */
export const getNumberOfMemberships = async (): Promise<number> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/${currentUser.uid}/memberships/count`;
    return getRequest<number>(endpoint, currentUser.uid);
}

/**
 * Get a list of grouping paths that the current user can opt into.
 * 
 * @returns The promise of the grouping paths or ApiError type
 */ 
export const optInGroupingPaths = async (): Promise<GroupingPaths & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
}

/**
 * Remove all members from the include group.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetIncludeGroup = async (
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include`
    return deleteRequest(endpoint, currentUser.uid);
}

/**
 * Remove all members from the include group asynchronously using polling.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetIncludeGroupAsync = async (
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include/async`
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
}

/**
 * Remove all members from the exclude group.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetExcludeGroup = async (
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude`
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
}

/**
 * Remove all members from the exclude group asynchronously using polling.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetExcludeGroupAsync = async (
    groupingPath: string
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude/async`
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
}

/**
 * Get a list of owners in the current path.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of the grouping group members or ApiError type
 */
export const groupingOwners = async (
    groupingPath: string
): Promise<GroupingGroupMembers & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/grouping/${groupingPath}/owners`;
    return getRequest<GroupingGroupMembers>(endpoint, currentUser.uid);
}

/**
 * Get the groupings the current user owns.
 * 
 * @returns The promise of the grouping paths or ApiError type
 */
export const ownerGroupings = async (): Promise<GroupingPaths & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings`;
    return getRequest<GroupingPaths>(endpoint, currentUser.uid);
}

/**
 * Get the number of groupings the current user owns.
 * 
 * @returns The promise of the number of groupings or ApiError type
 */
export const getNumberOfGroupings = async (): Promise<number> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings/count`;
    return getRequest<number>(endpoint, currentUser.uid);
}

/**
 * Checks if the owner of a grouping is the sole owner.
 * 
 * @param uhIdentifier - The uhIdentifier to check
 * @param groupingPath - The path of the grouping
 * 
 * @returns The promise of true if uhIdentifier is the sole owner of a grouping or ApiError type
 */
export const isSoleOwner = async (
    uhIdentifier: string,
    groupingPath: string
): Promise<boolean & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`;
    return getRequest<boolean>(endpoint, currentUser.uid);
}
