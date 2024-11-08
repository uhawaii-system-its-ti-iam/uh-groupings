'use server';

import { getCurrentUser } from '@/access/authentication';
import {
    ApiError,
    EmailResult,
    Feedback,
    GroupingAddResult,
    GroupingAddResults,
    GroupingMoveMemberResult,
    GroupingMoveMembersResult,
    GroupingRemoveResult,
    GroupingRemoveResults,
    GroupingUpdateDescriptionResult,
    MemberAttributeResults
} from './types';
import {
    deleteRequest,
    deleteRequestAsync,
    postRequest,
    postRequestAsync,
    putRequest,
    putRequestAsync
} from './http-client';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

// TODO:
// The setOptIn, setOptOut, setSyncDest service functions will be up to the person who works on
// implementing Opt Attributes and Sync Desinations into our React UI.

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
): Promise<GroupingUpdateDescriptionResult> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return putRequest<GroupingUpdateDescriptionResult>(endpoint, currentUser.uid, description);
};

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
};

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
};

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
};

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
};

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
};

/**
 * Add an admin to the UH Groupings admins.
 *
 * @param uhIdentifier - The uhIdentifier to add to admins
 *
 * @returns The promise of the grouping add results or ApiError type
 */
export const addAdmin = async (uhIdentifier: string): Promise<GroupingAddResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return postRequest<GroupingAddResult>(endpoint, currentUser.uid);
};

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
    groupPaths: string[]
): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${groupPaths}/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
};

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
};

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
};

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
};

/**
 * Remove an admin from the UH Groupings admins.
 *
 * @param uhIdentifier - The uhIdentifier to remove from admins
 *
 * @returns The promise of the grouping remove result or ApiError type
 */
export const removeAdmin = async (uhIdentifier: string): Promise<GroupingRemoveResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResult>(endpoint, currentUser.uid);
};

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName.
 *
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 *
 * @returns The promise of the member attribute results or ApiError type
 */
export const memberAttributeResults = async (uhIdentifiers: string[]): Promise<MemberAttributeResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/members`;
    return postRequest<MemberAttributeResults>(endpoint, currentUser.uid, uhIdentifiers);
};

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
};

/**
 * Opt a user into a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result or ApiError type
 */
export const optIn = async (groupingPath: string): Promise<GroupingMoveMemberResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
};

/**
 * Opt a member out of a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result or ApiError type
 */
export const optOut = async (groupingPath: string): Promise<GroupingMoveMemberResult & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the include group.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetIncludeGroup = async (groupingPath: string): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include`;
    return deleteRequest(endpoint, currentUser.uid);
};

/**
 * Remove all members from the include group asynchronously using polling.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetIncludeGroupAsync = async (groupingPath: string): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include/async`;
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the exclude group.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetExcludeGroup = async (groupingPath: string): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the exclude group asynchronously using polling.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results or ApiError type
 */
export const resetExcludeGroupAsync = async (groupingPath: string): Promise<GroupingRemoveResults & ApiError> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude/async`;
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Sends feedback to Groupings API to send email.
 *
 * @param feedback - the feedback
 *
 * @returns The EmailResult
 */
export const sendFeedback = async (feedback: Feedback): Promise<EmailResult> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/email/send/feedback`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, feedback);
};

/**
 * Sends feedback to Groupings API to send stack trace email.
 *
 * @param stackTrace - the stack trace
 *
 * @returns The EmailResult
 */
export const sendStackTrace = async (stackTrace: string): Promise<EmailResult> => {
    const currentUser = await getCurrentUser();
    const endpoint = `${baseUrl}/email/send/stack-trace`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, stackTrace, 'text/plain');
};
