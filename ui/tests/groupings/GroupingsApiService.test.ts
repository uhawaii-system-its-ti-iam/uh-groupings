import { 
    addAdmin,
    addExcludeMembers,
    addExcludeMembersAsync,
    addIncludeMembers,
    addIncludeMembersAsync,
    addOwners,
    getAllGroupings,
    getAnnouncements, 
    getNumberOfGroupings, 
    getNumberOfMemberships, 
    groupingAdmins, 
    groupingDescription, 
    groupingOptAttributes, 
    groupingOwners, 
    groupingSyncDest, 
    isSoleOwner, 
    managePersonResults, 
    memberAttributeResults, 
    memberAttributeResultsAsync, 
    membershipResults, 
    optIn, 
    optInGroupingPaths, 
    optOut, 
    ownedGrouping, 
    ownerGroupings, 
    removeAdmin, 
    removeExcludeMembers, 
    removeFromGroups, 
    removeIncludeMembers, 
    removeOwners, 
    resetExcludeGroup, 
    resetExcludeGroupAsync, 
    resetIncludeGroup, 
    resetIncludeGroupAsync, 
    updateDescription
} from '@/services/GroupingsApiService';
import axios from 'axios';
import * as AuthenticationService from '@/access/AuthenticationService';
import User from '@/access/User';
import MockAdapter from 'axios-mock-adapter';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

jest.mock('@/access/AuthenticationService');

describe('GroupingsService', () => {

    const currentUser =  testUser;
    const headers = { headers: { 'current_user': currentUser.uid } };
    
    const uhIdentifier = 'testiwta';
    const uhIdentifiers = ['testiwta', 'testiwtb'];
    const groupingPath = 'tmp:testiwta:testiwta-aux';
    const groupPaths = [
        `${groupingPath}:include`, 
        `${groupingPath}:include`,
        `${groupingPath}:exclude`, 
        `${groupingPath}:owners`
    ];

    const mockResponse = {
        data: {
            resultCode: 'SUCCESS'
        }
    }
    const mockAsyncCompletedResponse = {
        data: {
            status: 'COMPLETED',
            result: {
                resultCode: 'SUCCESS'
            }
        }
    }
    const mockAsyncInProgressResponse = {
        data: {
            status: 'IN_PROGRESS'
        }
    }
    const mockError = {
        response: {
            data: {
                resultCode: 'FAILURE'
            }
        }
    }

    beforeAll(() => {
        jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
    })

    beforeEach(() => {
        new MockAdapter(axios);
    });

    describe('getAnnouncements', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await getAnnouncements();
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/announcements`);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await getAnnouncements();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await getAnnouncements();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('ownedGrouping', () => {
        const page = 1;
        const size = 700;
        const sortString = 'name';
        const isAscending = true;

        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await ownedGrouping(groupPaths, page, size, sortString, isAscending);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/group?`
                + `page=${page}&size=${size}&sortString=${sortString}&isAscending=${isAscending}`, 
            groupPaths, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const res = await ownedGrouping(groupPaths, page, size, sortString, isAscending);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await ownedGrouping(groupPaths, page, size, sortString, isAscending);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('groupingDescription', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await groupingDescription(groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await groupingDescription(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await groupingDescription(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('groupingSyncDest', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await groupingSyncDest(groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`,
                headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await groupingSyncDest(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await groupingSyncDest(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('groupingOptAttributes', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await groupingOptAttributes(groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/opt-attributes`,
                headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await groupingOptAttributes(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await groupingOptAttributes(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('updateDescription', () => {
        const description = 'description';

        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await updateDescription(description, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, description, 
                headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const res = await updateDescription(description, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await updateDescription(description, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('groupingAdmins', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await groupingAdmins();
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/grouping-admins`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await groupingAdmins();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await groupingAdmins();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('getAllGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await getAllGroupings();
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/all-groupings`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await getAllGroupings();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await getAllGroupings();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('AddIncludeMembers', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await addIncludeMembers(uhIdentifiers, groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members`, uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(mockResponse);
            const res = await addIncludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await addIncludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('addIncludeMembersAsync', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await addIncludeMembersAsync(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(
                `${baseUrl}/groupings/${groupingPath}/include-members/async`, uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncInProgressResponse);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncCompletedResponse);

            const res = addIncludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.data.result);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await addIncludeMembersAsync(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);

            jest.spyOn(axios, 'put').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res2 = addIncludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res2).toEqual(mockError.response.data);
        });
    });

    describe('addExcludeMembers', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await addExcludeMembers(uhIdentifiers, groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members`, uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(mockResponse);
            const res = await addExcludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await addExcludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('addExcludeMembersAsync', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await addExcludeMembersAsync(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members/async`, 
                uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncInProgressResponse);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncCompletedResponse);
            
            const res = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.data.result);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await addExcludeMembersAsync(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);

            jest.spyOn(axios, 'put').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res2 = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res2).toEqual(mockError.response.data);
        });
    });

    describe('addOwners', () => {
        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await addOwners(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`, 
                undefined, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const res = await addOwners(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await addOwners(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('addAdmin', () => {
        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await addAdmin(uhIdentifier);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/admins/${uhIdentifier}`, undefined, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const res = await addAdmin(uhIdentifier);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await addAdmin(uhIdentifier);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('removeFromGroups', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await removeFromGroups(uhIdentifier, groupPaths);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/admins/${groupPaths}/${uhIdentifier}`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await removeFromGroups(uhIdentifier, groupPaths);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await removeFromGroups(uhIdentifier, groupPaths);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('removeIncludeMembers', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await removeIncludeMembers(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members`, 
                { data: uhIdentifiers, ...headers });
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await removeIncludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await removeIncludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('removeExcludeMembers', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await removeExcludeMembers(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members`, 
                { data: uhIdentifiers, ...headers });
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await removeExcludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await removeExcludeMembers(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('removeOwners', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await removeOwners(uhIdentifiers, groupingPath);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`, 
                headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await removeOwners(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await removeOwners(uhIdentifiers, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('removeAdmin', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await removeAdmin(uhIdentifier);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/admins/${uhIdentifier}`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await removeAdmin(uhIdentifier);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await removeAdmin(uhIdentifier);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('memberAttributeResults', () => {
        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await memberAttributeResults(uhIdentifiers);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/members`, uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const res = await memberAttributeResults(uhIdentifiers);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await memberAttributeResults(uhIdentifiers);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('memberAttributeResultsAsync', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a POST request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'post');
            await memberAttributeResultsAsync(uhIdentifiers);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/members/async`, uhIdentifiers, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'post').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncInProgressResponse);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncCompletedResponse);
            
            const res = memberAttributeResultsAsync(uhIdentifiers);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.data.result);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue(mockError);
            const res = await memberAttributeResultsAsync(uhIdentifiers);
            expect(res).toEqual(mockError.response.data);

            jest.spyOn(axios, 'post').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res2 = memberAttributeResultsAsync(uhIdentifiers);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res2).toEqual(mockError.response.data);
        });
    });

    describe('optIn', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await optIn(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`, 
                    undefined, headers)
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(mockResponse);
            const res = await optIn(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await optIn(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('optOut', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'put');
            await optOut(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`, 
                    undefined, headers)
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'put').mockResolvedValue(mockResponse);
            const res = await optOut(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'put').mockRejectedValue(mockError);
            const res = await optOut(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('membershipResults', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await membershipResults();
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/members/${currentUser.uid}/memberships`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await membershipResults();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await membershipResults();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('managePersonResults', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await managePersonResults(uhIdentifier);
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/members/${uhIdentifier}/groupings`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await managePersonResults(uhIdentifier);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await managePersonResults(uhIdentifier);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('getNumberOfMemberships', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await getNumberOfMemberships();
            expect(requestSpy).toHaveBeenCalledWith(`${baseUrl}/members/memberships/count`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await getNumberOfMemberships();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await getNumberOfMemberships();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('optInGroupingPaths', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await optInGroupingPaths();
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await optInGroupingPaths();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await optInGroupingPaths();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('resetIncludeGroup', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await resetIncludeGroup(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await resetIncludeGroup(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await resetIncludeGroup(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('resetIncludeGroupAsync', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await resetIncludeGroupAsync(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include/async`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncInProgressResponse);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncCompletedResponse);
            
            const res = resetIncludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.data.result);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await resetIncludeGroupAsync(groupingPath);
            expect(res).toEqual(mockError.response.data);

            jest.spyOn(axios, 'delete').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res2 = resetIncludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res2).toEqual(mockError.response.data);
        });
    });

    describe('resetExcludeGroup', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await resetExcludeGroup(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const res = await resetExcludeGroup(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await resetExcludeGroup(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });
    
    describe('resetExcludeGroupAsync', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a DELETE request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'delete');
            await resetExcludeGroupAsync(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude/async`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'delete').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncInProgressResponse);
            jest.spyOn(axios, 'get').mockResolvedValueOnce(mockAsyncCompletedResponse);
            
            const res = resetExcludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.data.result);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'delete').mockRejectedValue(mockError);
            const res = await resetExcludeGroupAsync(groupingPath);
            expect(res).toEqual(mockError.response.data);

            jest.spyOn(axios, 'delete').mockResolvedValue(0);
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res2 = resetExcludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res2).toEqual(mockError.response.data);
        });
    });

    describe('groupingOwners', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await groupingOwners(groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/grouping/${groupingPath}/owners`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await groupingOwners(groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await groupingOwners(groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('ownersGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await ownerGroupings();
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await ownerGroupings();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await ownerGroupings();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('getNumberOfGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await getNumberOfGroupings();
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings/count`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await getNumberOfGroupings();
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await getNumberOfGroupings();
            expect(res).toEqual(mockError.response.data);
        });
    });

    describe('isSoleOwner', () => {
        it('should make a GET request at the correct endpoint', async () => {
            const requestSpy = jest.spyOn(axios, 'get');
            await isSoleOwner(uhIdentifier, groupingPath);
            expect(requestSpy)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`, headers);
        });

        it('should handle the successful response', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const res = await isSoleOwner(uhIdentifier, groupingPath);
            expect(res).toEqual(mockResponse.data);
        });

        it('should handle the error response', async () => {
            jest.spyOn(axios, 'get').mockRejectedValue(mockError);
            const res = await isSoleOwner(uhIdentifier, groupingPath);
            expect(res).toEqual(mockError.response.data);
        });
    });

});
