'use server';

import {
    EmailResult,
    Feedback,
    GroupingAddResult,
    GroupingAddResults,
    GroupingGroupMembers,
    GroupingMembers,
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
    getRequest,
    postRequest,
    postRequestAsync,
    putRequest,
    putRequestAsync
} from './http-client';
import { getUser } from '@/lib/access/user';
import { z } from 'zod';
import SortBy from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/sort-by';

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
 * @returns The promise of the result of updating the description
 */
export const updateDescription = async (
    description: string,
    groupingPath: string
): Promise<GroupingUpdateDescriptionResult> => {
    z.object({ description: z.string(), groupingPath: z.string() }).parse({ description, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/description`;
    return putRequest<GroupingUpdateDescriptionResult>(endpoint, currentUser.uid, description);
};

/**
 * Add members to the include group of a grouping.
 *
 * @param uhIdentifiers - The list of uhIdentifiers to add
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const addIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return putRequest<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Add members to the include group of a grouping asynchronously using polling.
 *
 * @param uhIdentifiers - The list of uhIdentifiers to add to include
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const addIncludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/async`;
    return putRequestAsync<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Add members to the exclude group of a grouping.
 *
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const addExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return putRequest<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Add members to the exclude group of a grouping asynchronously using polling.
 *
 * @param uhIdentifiers - The list of uhIdentifiers to add to exclude
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const addExcludeMembersAsync = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingMoveMembersResult> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/async`;
    return putRequestAsync<GroupingMoveMembersResult>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Add an owner to the owners group of a grouping.
 *
 * @param uhIdentifiers - The uhIdentifiers to add to owners
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping add results
 */
export const addOwners = async (uhIdentifiers: string[], groupingPath: string): Promise<GroupingAddResults> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return postRequest<GroupingAddResults>(endpoint, currentUser.uid);
};

/**
 * Add an admin to the UH Groupings admins.
 *
 * @param uhIdentifier - The uhIdentifier to add to admins
 *
 * @returns The promise of the grouping add results
 */
export const addAdmin = async (uhIdentifier: string): Promise<GroupingAddResult> => {
    z.string().parse(uhIdentifier);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return postRequest<GroupingAddResult>(endpoint, currentUser.uid);
};

/**
 * Remove a uhIdentifier from multiple groupings.
 *
 * @param uhIdentifier - The uhIdentifier to remove from groups
 * @param groupPaths - The paths to the groups to remove from
 *
 * @returns The promise of the grouping remove results
 */
export const removeFromGroups = async (uhIdentifier: string, groupPaths: string[]): Promise<GroupingRemoveResults> => {
    z.object({ uhIdentifier: z.string(), groupPaths: z.array(z.string()) }).parse({ uhIdentifier, groupPaths });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/admins/${groupPaths}/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove members from include group of grouping.
 *
 * @param uhIdentifiers - The uhIdentifiers to remove from the include
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const removeIncludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Remove members from exclude group of grouping.
 *
 * @param uhIdentifiers - The uhIdentifiers to remove from the exclude
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const removeExcludeMembers = async (
    uhIdentifiers: string[],
    groupingPath: string
): Promise<GroupingRemoveResults> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Remove owners from owners group of grouping.
 *
 * @param uhIdentifiers - The uhIdentifiers to remove from owners
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const removeOwners = async (uhIdentifiers: string[], groupingPath: string): Promise<GroupingRemoveResults> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove an admin from the UH Groupings admins.
 *
 * @param uhIdentifier - The uhIdentifier to remove from admins
 *
 * @returns The promise of the grouping remove result
 */
export const removeAdmin = async (uhIdentifier: string): Promise<GroupingRemoveResult> => {
    z.string().parse(uhIdentifier);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/admins/${uhIdentifier}`;
    return deleteRequest<GroupingRemoveResult>(endpoint, currentUser.uid);
};

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName.
 *
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 *
 * @returns The promise of the member attribute results
 */
export const memberAttributeResults = async (uhIdentifiers: string[]): Promise<MemberAttributeResults> => {
    z.array(z.string()).parse(uhIdentifiers);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/members`;
    return postRequest<MemberAttributeResults>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Get the attributes of a user, which includes their uid, uhUuid, name, firstName, and lastName
 * asynchronously using polling.
 *
 * @param uhIdentifiers - The uhIdentifiers to get the attributes of
 *
 * @returns The promise of the member attribute results
 */
export const memberAttributeResultsAsync = async (uhIdentifiers: string[]): Promise<MemberAttributeResults> => {
    z.array(z.string()).parse(uhIdentifiers);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/members/async`;
    return postRequestAsync<MemberAttributeResults>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Opt a user into a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const optIn = async (groupingPath: string): Promise<GroupingMoveMemberResult> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
};

/**
 * Opt a member out of a grouping.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping move member result
 */
export const optOut = async (groupingPath: string): Promise<GroupingMoveMemberResult> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`;
    return putRequest<GroupingMoveMemberResult>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the include group.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const resetIncludeGroup = async (groupingPath: string): Promise<GroupingRemoveResults> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include`;
    return deleteRequest(endpoint, currentUser.uid);
};

/**
 * Remove all members from the include group asynchronously using polling.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const resetIncludeGroupAsync = async (groupingPath: string): Promise<GroupingRemoveResults> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/include/async`;
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the exclude group.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const resetExcludeGroup = async (groupingPath: string): Promise<GroupingRemoveResults> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude`;
    return deleteRequest<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Remove all members from the exclude group asynchronously using polling.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the grouping remove results
 */
export const resetExcludeGroupAsync = async (groupingPath: string): Promise<GroupingRemoveResults> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/exclude/async`;
    return deleteRequestAsync<GroupingRemoveResults>(endpoint, currentUser.uid);
};

/**
 * Sends feedback to Groupings API to send email.
 *
 * @param feedback - The feedback
 *
 * @returns The promise of the EmailResult
 */
export const sendFeedback = async (feedback: Feedback): Promise<EmailResult> => {
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/email/send/feedback`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, feedback);
};

/**
 * Sends feedback to Groupings API to send stack trace email.
 *
 * @param stackTrace - The stack trace
 *
 * @returns The promise of the EmailResult
 */
export const sendStackTrace = async (stackTrace: string): Promise<EmailResult> => {
    z.string().parse(stackTrace);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/email/send/stack-trace`;
    return postRequest<EmailResult>(endpoint, currentUser.uid, stackTrace, 'text/plain');
};

/**
 * Get paginated members by a grouping path.
 *
 * @param groupingPath - The path of the grouping
 * @param params - The object of page (page number), size (page size),
 * sortString (field to sort the results by), and isAscending (sorted ascending order) params
 *
 * @returns The promise of grouping group members
 */
export const getGroupingMembers = async (
    groupingPath: string,
    params: {
        page?: number;
        size?: number;
        sortBy: SortBy;
        isAscending: boolean;
        searchString?: string;
    }
): Promise<GroupingGroupMembers> => {
    const { page, size, sortBy, isAscending, searchString } = params;
    z.object({
        groupingPath: z.string(),
        page: z.number().optional(),
        size: z.number().optional(),
        sortBy: z.string(),
        isAscending: z.boolean(),
        searchString: z.string().optional()
    }).parse({
        groupingPath,
        page,
        size,
        sortBy,
        isAscending,
        searchString
    });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}?${new URLSearchParams({
        ...(page && { page: page.toString() }),
        ...(size && { size: size.toString() }),
        sortBy,
        isAscending: isAscending.toString(),
        ...(searchString && { searchString })
    })}`;
    return getRequest<GroupingGroupMembers>(endpoint, currentUser.uid);
};

/**
 * Get number of grouping members.
 *
 * @param groupingPath - The path of the grouping
 *
 * @returns The promise of the number of grouping members
 */
export const getNumberOfGroupingMembers = async (groupingPath: string): Promise<number> => {
    z.string().parse(groupingPath);
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/count`;
    return getRequest<number>(endpoint, currentUser.uid);
};

/**
 * Get is basis information for members of a grouping path.
 *
 * @param groupingPath - The path of the grouping
 * @param uhIdentifiers - The list of uhIdentifiers
 *
 * @returns The promise of grouping members
 */
export const getGroupingMembersIsBasis = async (
    groupingPath: string,
    uhIdentifiers: string[]
): Promise<GroupingMembers> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/is-basis`;
    return postRequest<GroupingMembers>(endpoint, currentUser.uid, uhIdentifiers);
};

/**
 * Get where listed information for members of a grouping path.
 *
 * @param groupingPath - The path of the grouping
 * @param uhIdentifiers - The list of uhIdentifiers
 *
 * @returns The promise of grouping members
 */
export const getGroupingMembersWhereListed = async (
    groupingPath: string,
    uhIdentifiers: string[]
): Promise<GroupingMembers> => {
    z.object({ uhIdentifiers: z.array(z.string()), groupingPath: z.string() }).parse({ uhIdentifiers, groupingPath });
    const currentUser = await getUser();
    const endpoint = `${baseUrl}/groupings/${groupingPath}/where-listed`;
    return postRequest<GroupingMembers>(endpoint, currentUser.uid, uhIdentifiers);
};
