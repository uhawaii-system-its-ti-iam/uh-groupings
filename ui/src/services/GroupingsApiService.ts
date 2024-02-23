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
} from './GroupingsApiResults';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;
const maxRetries = 3;

// TODO: 
// The setOptIn, setOptOut, setSyncDest service functions will be up to the person who works on 
// implementing Opt Attributes and Sync Desinations into our React UI.

/**
 * Polls to getAsyncJobResult API endpoint until the async job has completed with a result.
 * 
 * @param jobId - the jobId returned from the response of an async endpoint
 * 
 * @returns The result T
 */
const poll = async <T> (jobId: number): Promise<T | ApiError> => {
    const delay = async (ms = 5000) => new Promise((res) => setTimeout(res, ms));

    const currentUser = await getCurrentUser();
    return axios.get(`${baseUrl}/jobs/${jobId}`, { headers: { 'current_user': currentUser.uid } })
        .then(async (response) => {
            if (response.data.status === 'COMPLETED') {
                return response.data.result;
            } else {
                await delay();
                return poll(jobId);
            }
        })
        .catch(error => error.response.data);
}

/**
 * Get a list of announcements to display on the home page.
 * 
 * @returns The announcements
 */
export const getAnnouncements = (): Promise<Announcements | ApiError> => {
    const endpoint = `${baseUrl}/announcements`;
    return axios.get(endpoint)
        .then(response => response.data)
        .catch(error => error.response.data);
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
 * @returns The members of an owned grouping
 */
export const ownedGrouping = async (
    groupPaths: string[],
    page: number,
    size: number,
    sortString: string,
    isAscending: boolean
): Promise<GroupingGroupsMembers | ApiError> => {
    const currentUser = await getCurrentUser();
    const params = new URLSearchParams({ 
        page: page.toString(), 
        size: size.toString(), 
        sortString, 
        isAscending: isAscending.toString() 
    });
    const endpoint = `${baseUrl}/groupings/group?${params.toString()}`;

    axiosRetry(axios, { retries: maxRetries, retryDelay: axiosRetry.exponentialDelay });
    return axios.post(endpoint, groupPaths, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the description of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping description
 */
export const groupingDescription = async (
    groupingPath: string
): Promise<GroupingDescription | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the sync destinations of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping sync destinations
 */
export const groupingSyncDest = async (
    groupingPath: string
): Promise<GroupingSyncDestinations | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the opt attributes of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping opt attributes
 */
export const groupingOptAttributes = async (
    groupingPath: string
): Promise<GroupingOptAttributes | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/opt-attributes`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Update the description of grouping at path.
 * 
 * @param description - The new description
 * @param groupingPath - The path of the grouping
 * 
 * @returns The result of updating the description
 */
export const updateDescription = async (
    description: string,
    groupingPath: string
): Promise<GroupingUpdateDescriptionResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return axios.post(endpoint, description, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get a list of admins.
 * 
 * @returns The grouping admins
 */
export const groupingAdmins = async (): Promise<GroupingGroupMembers | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/grouping-admins`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get a list of all grouping paths.
 * 
 * @returns All the grouping paths
 */
export const getAllGroupings = async (): Promise<GroupingPaths | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/all-groupings`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Add members to the include group of a grouping.
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const addIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return axios.put(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Add members to the include group of a grouping asynchronously using polling. 
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to include
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const addIncludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/async`;
    return axios.put(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => poll<GroupingMoveMembersResult>(response.data))
        .catch(error => error.response.data);
}

/**
 * Add members to the exclude group of a grouping.
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const addExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return axios.put(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Add members to the exclude group of a grouping asynchronously using polling. 
 * 
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const addExcludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/async`;
    return axios.put(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => poll<GroupingMoveMembersResult>(response.data))
        .catch(error => error.response.data);
}

/**
 * Add an owner to the owners group of a grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to add to owners
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping add results
 */
export const addOwners = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingAddResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return axios.post(endpoint, undefined, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Add an admin to the UH Groupings admins.
 * 
 * @param uhIdentifier - The uhIdentifier to add to admins
 * 
 * @returns The grouping add results
 */
export const addAdmin = async (
    uhIdentifier: string
): Promise<GroupingAddResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return axios.post(endpoint, undefined, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove a uhIdentifier from multiple groupings.
 * 
 * @param uhIdentifier - The uhIdentifier to remove from groups
 * @param groupPaths - The paths to the groups to remove from
 * 
 * @returns The grouping remove results
 */
export const removeFromGroups = async (
    uhIdentifier: string,
    groupPaths: string[],
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${groupPaths}/${uhIdentifier}`;
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove members from include group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from the include
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const removeIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return axios.delete(endpoint, { data: uhIdentifiers, headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove members from exclude group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from the exclude
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const removeExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return axios.delete(endpoint, { data: uhIdentifiers, headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove owners from owners group of grouping.
 * 
 * @param uhIdentifiers - The uhIdentifiers to remove from owners
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const removeOwners = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove an admin from the UH Groupings admins.
 * 
 * @param uhIdentifier - The uhIdentifier to remove from admins
 * 
 * @returns The grouping remove result
 */
export const removeAdmin = async (
    uhIdentifier: string
): Promise<GroupingRemoveResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName.
 * 
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 * 
 * @returns The member attribute results
 */
export const memberAttributeResults = async (
    uhIdentifiers: string[]
): Promise<MemberAttributeResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members`;
    return axios.post(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName 
 * asynchronously using polling.
 * 
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 * 
 * @returns The member attribute results
 */
export const memberAttributeResultsAsync = async (
    uhIdentifiers: string[]
): Promise<MemberAttributeResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/async`;
    return axios.post(endpoint, uhIdentifiers, { headers: { 'current_user': currentUser.uid } })
        .then(response => poll<MemberAttributeResults>(response.data))
        .catch(error => error.response.data);
}

/**
 * Opt a user into a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const optIn = async (
    groupingPath: string
): Promise<GroupingMoveMemberResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`;
    return axios.put(endpoint, undefined, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Opt a member out of a grouping.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping move member result
 */
export const optOut = async (
    groupingPath: string
): Promise<GroupingMoveMemberResult | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`;
    return axios.put(endpoint, undefined, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get a list of memberships that the current user is associated with.
 * 
 * @returns The membership results
 */
export const membershipResults = async (): Promise<MembershipResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/${currentUser.uid}/memberships`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get a list of all groupings that a user is associated with.
 * 
 * @param uhIdentifier - The uhIdentifier to search in Manage Person
 * 
 * @returns The membership results
 */
export const managePersonResults = async (
    uhIdentifier: string
): Promise<MembershipResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/${uhIdentifier}/groupings`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the number of memberships the current user has
 * 
 * @returns The number of memberships
 */
export const getNumberOfMemberships = async (): Promise<number | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members/memberships/count`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get a list of grouping paths that the current user can opt into.
 * 
 * @returns The grouping paths
 */
export const optInGroupingPaths = async (): Promise<GroupingPaths | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove all members from the include group.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const resetIncludeGroup = async (
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include`
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove all members from the include group asynchronously using polling.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const resetIncludeGroupAsync = async (
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include/async`
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => poll<GroupingRemoveResults>(response.data))
        .catch(error => error.response.data);
}

/**
 * Remove all members from the exclude group.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const resetExcludeGroup = async (
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude`
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Remove all members from the exclude group asynchronously using polling.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping remove results
 */
export const resetExcludeGroupAsync = async (
    groupingPath: string
): Promise<GroupingRemoveResults | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude/async`
    return axios.delete(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => poll<GroupingRemoveResults>(response.data))
        .catch(error => error.response.data);
}

/**
 * Get a list of owners in the current path.
 * 
 * @param groupingPath - The path of the grouping
 * 
 * @returns The grouping group members
 */
export const groupingOwners = async (
    groupingPath: string
): Promise<GroupingGroupMembers | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/grouping/${groupingPath}/owners`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the groupings the current user owns.
 * 
 * @returns The grouping paths
 */
export const ownerGroupings = async (): Promise<GroupingPaths | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Get the number of groupings the current user owns.
 * 
 * @returns The number of groupings
 */
export const getNumberOfGroupings = async (): Promise<number | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/owners/${currentUser.uid}/groupings/count`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}

/**
 * Checks if the owner of a grouping is the sole owner.
 * 
 * @param uhIdentifier - The uhIdentifier to check
 * @param groupingPath - The path of the grouping
 * 
 * @returns True if uhIdentifier is the sole owner of a grouping
 */
export const isSoleOwner = async (
    uhIdentifier: string,
    groupingPath: string
): Promise<boolean | ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`;
    return axios.get(endpoint, { headers: { 'current_user': currentUser.uid } })
        .then(response => response.data)
        .catch(error => error.response.data);
}
