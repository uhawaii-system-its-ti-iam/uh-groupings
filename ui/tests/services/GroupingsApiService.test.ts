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
import * as AuthenticationService from '@/access/AuthenticationService';
import User from '@/access/User';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

jest.mock('@/access/AuthenticationService');

describe('GroupingsService', () => {

    const currentUser =  testUser;
    const headers = { 'current_user': currentUser.uid };
    
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
        resultCode: 'SUCCESS'
    }
    const mockAsyncCompletedResponse = {
        status: 'COMPLETED',
        result: {
            resultCode: 'SUCCESS'
        }
    }
    const mockAsyncInProgressResponse = {
        status: 'IN_PROGRESS'
    }
    const mockError = {
        resultCode: 'FAILURE'
    }

    beforeAll(() => {
        jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
    })

    describe('getAnnouncements', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getAnnouncements();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/announcements`, {
                headers: { 'current_user': ''}
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await getAnnouncements()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await getAnnouncements()).toEqual(mockError);
        });
    });

    describe('ownedGrouping', () => {
        const page = 1;
        const size = 700;
        const sortString = 'name';
        const isAscending = true;

        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should make a POST request at the correct endpoint', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            await ownedGrouping(groupPaths, page, size, sortString, isAscending);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/group?`
                + `page=${page}&size=${size}&sortString=${sortString}&isAscending=${isAscending}`, {
                body: JSON.stringify(groupPaths),
                headers,
                method: 'POST'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await ownedGrouping(groupPaths, page, size, sortString, isAscending)).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            let res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockError), { status: 500 });
            let res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);

            fetchMock.mockReject(() => Promise.reject(mockError));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('groupingDescription', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingDescription(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingDescription(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingDescription(groupingPath)).toEqual(mockError);
        });
    });

    describe('groupingSyncDest', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingSyncDest(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`,
                { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingSyncDest(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingSyncDest(groupingPath)).toEqual(mockError);
        });
    });

    describe('groupingOptAttributes', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingOptAttributes(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/opt-attributes`,
                { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingOptAttributes(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingOptAttributes(groupingPath)).toEqual(mockError);
        });
    });

    describe('updateDescription', () => {
        const description = 'description';

        it('should make a POST request at the correct endpoint', async () => {
            await updateDescription(description, groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, {
                body: JSON.stringify(description),
                headers,
                method: 'POST'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await updateDescription(description, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await updateDescription(description, groupingPath)).toEqual(mockError);
        });
    });

    describe('groupingAdmins', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingAdmins();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/grouping-admins`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingAdmins()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingAdmins()).toEqual(mockError);
        });
    });

    describe('getAllGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getAllGroupings();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/all-groupings`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await getAllGroupings()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await getAllGroupings()).toEqual(mockError);
        });
    });

    describe('AddIncludeMembers', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            await addIncludeMembers(uhIdentifiers, groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members`, {
                    body: JSON.stringify(uhIdentifiers), 
                    headers,
                    method: 'PUT'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await addIncludeMembers(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await addIncludeMembers(uhIdentifiers, groupingPath)).toEqual(mockError);
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
            await addIncludeMembersAsync(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(
                `${baseUrl}/groupings/${groupingPath}/include-members/async`,{
                    body: JSON.stringify(uhIdentifiers), 
                    headers,
                    method: 'PUT'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockResponseOnce(JSON.stringify(mockAsyncInProgressResponse))
                .mockResponseOnce(JSON.stringify(mockAsyncCompletedResponse));

            const res = addIncludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.result);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            let res = addIncludeMembersAsync(uhIdentifiers, groupingPath);
            expect(await res).toEqual(mockError);

            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockRejectOnce(() => Promise.reject(mockError));
            res = addIncludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('addExcludeMembers', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            await addExcludeMembers(uhIdentifiers, groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members`, {
                    body: JSON.stringify(uhIdentifiers), 
                    headers,
                    method: 'PUT'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await addExcludeMembers(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await addExcludeMembers(uhIdentifiers, groupingPath)).toEqual(mockError);
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
            await addExcludeMembersAsync(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(
                `${baseUrl}/groupings/${groupingPath}/exclude-members/async`,{
                    body: JSON.stringify(uhIdentifiers), 
                    headers,
                    method: 'PUT'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockResponseOnce(JSON.stringify(mockAsyncInProgressResponse))
                .mockResponseOnce(JSON.stringify(mockAsyncCompletedResponse));

            const res = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.result);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            let res = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            expect(await res).toEqual(mockError);

            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockRejectOnce(() => Promise.reject(mockError));
            res = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('addOwners', () => {
        it('should make a POST request at the correct endpoint', async () => {
            await addOwners(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`, {
                headers,
                method: 'POST'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await addOwners(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await addOwners(uhIdentifiers, groupingPath)).toEqual(mockError);
        });
    });

    describe('addAdmin', () => {
        it('should make a POST request at the correct endpoint', async () => {
            await addAdmin(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/admins/${uhIdentifier}`, {
                headers,
                method: 'POST'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await addAdmin(uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await addAdmin(uhIdentifier)).toEqual(mockError);
        });
    });

    describe('removeFromGroups', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await removeFromGroups(uhIdentifier, groupPaths);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/admins/${groupPaths}/${uhIdentifier}`, {
                headers,
                method: 'DELETE'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await removeFromGroups(uhIdentifier, groupPaths)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await removeFromGroups(uhIdentifier, groupPaths)).toEqual(mockError);
        });
    });

    describe('removeIncludeMembers', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await removeIncludeMembers(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members`, {
                body: JSON.stringify(uhIdentifiers),
                headers,
                method: 'DELETE'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await removeIncludeMembers(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await removeIncludeMembers(uhIdentifiers, groupingPath)).toEqual(mockError);
        });
    });

    describe('removeExcludeMembers', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await removeExcludeMembers(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members`, {
                body: JSON.stringify(uhIdentifiers),
                headers,
                method: 'DELETE'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await removeExcludeMembers(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await removeExcludeMembers(uhIdentifiers, groupingPath)).toEqual(mockError);
        });
    });

    describe('removeOwners', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await removeOwners(uhIdentifiers, groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifiers}`, {
                headers,
                method: 'DELETE'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await removeOwners(uhIdentifiers, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await removeOwners(uhIdentifiers, groupingPath)).toEqual(mockError);
        });
    });

    describe('removeAdmin', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await removeAdmin(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/admins/${uhIdentifier}`,  { 
                headers,
                method: 'DELETE'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await removeAdmin(uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await removeAdmin(uhIdentifier)).toEqual(mockError);
        });
    });

    describe('memberAttributeResults', () => {
        it('should make a POST request at the correct endpoint', async () => {
            await memberAttributeResults(uhIdentifiers);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members`, {
                body: JSON.stringify(uhIdentifiers),
                headers,
                method: 'POST'
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await memberAttributeResults(uhIdentifiers)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await memberAttributeResults(uhIdentifiers)).toEqual(mockError);
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
            await memberAttributeResultsAsync(uhIdentifiers);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/async`, {
                body: JSON.stringify(uhIdentifiers),
                headers,
                method: 'POST' 
            });
        });

        it('should handle the successful response', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockResponseOnce(JSON.stringify(mockAsyncInProgressResponse))
                .mockResponseOnce(JSON.stringify(mockAsyncCompletedResponse));

            const res = memberAttributeResultsAsync(uhIdentifiers);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.result);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            let res = memberAttributeResultsAsync(uhIdentifiers);
            expect(await res).toEqual(mockError);

            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockRejectOnce(() => Promise.reject(mockError));
            res = addExcludeMembersAsync(uhIdentifiers, groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('optIn', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            await optIn(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include-members/${currentUser.uid}/self`, {
                    headers,
                    method: 'PUT'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await optIn(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await optIn(groupingPath)).toEqual(mockError);
        });
    });

    describe('optOut', () => {
        it('should make a PUT request at the correct endpoint', async () => {
            await optOut(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude-members/${currentUser.uid}/self`, {
                    headers,
                    method: 'PUT'
                })
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await optOut(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await optOut(groupingPath)).toEqual(mockError);
        });
    });

    describe('membershipResults', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await membershipResults();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${currentUser.uid}/memberships`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await membershipResults()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await membershipResults()).toEqual(mockError);
        });
    });

    describe('managePersonResults', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await managePersonResults(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${uhIdentifier}/groupings`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await managePersonResults(uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await managePersonResults(uhIdentifier)).toEqual(mockError);
        });
    });

    describe('getNumberOfMemberships', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getNumberOfMemberships();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${currentUser.uid}/memberships/count`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await getNumberOfMemberships()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await getNumberOfMemberships()).toEqual(mockError);
        });
    });

    describe('optInGroupingPaths', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await optInGroupingPaths();
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await optInGroupingPaths()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await optInGroupingPaths()).toEqual(mockError);
        });
    });

    describe('resetIncludeGroup', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await resetIncludeGroup(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include`, { 
                    headers,
                    method: 'DELETE'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await resetIncludeGroup(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await resetIncludeGroup(groupingPath)).toEqual(mockError);
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
            await resetIncludeGroupAsync(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/include/async`, {
                    headers,
                    method: 'DELETE'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockResponseOnce(JSON.stringify(mockAsyncInProgressResponse))
                .mockResponseOnce(JSON.stringify(mockAsyncCompletedResponse));

            const res = resetIncludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.result);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            let res = resetIncludeGroupAsync(groupingPath);
            expect(await res).toEqual(mockError);

            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockRejectOnce(() => Promise.reject(mockError));
            res = resetIncludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('resetExcludeGroup', () => {
        it('should make a DELETE request at the correct endpoint', async () => {
            await resetExcludeGroup(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude`, {
                    headers,
                    method: 'DELETE'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await resetExcludeGroup(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await resetExcludeGroup(groupingPath)).toEqual(mockError);
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
            await resetExcludeGroupAsync(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/exclude/async`, {
                    headers,
                    method: 'DELETE'
                });
        });

        it('should handle the successful response', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockResponseOnce(JSON.stringify(mockAsyncInProgressResponse))
                .mockResponseOnce(JSON.stringify(mockAsyncCompletedResponse));

            const res = resetExcludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            
            expect(await res).toEqual(mockAsyncCompletedResponse.result);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            let res = resetExcludeGroupAsync(groupingPath);
            expect(await res).toEqual(mockError);

            fetchMock
                .mockResponseOnce(JSON.stringify(0))
                .mockRejectOnce(() => Promise.reject(mockError));
            res = resetExcludeGroupAsync(groupingPath);
            await jest.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('groupingOwners', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingOwners(groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/grouping/${groupingPath}/owners`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingOwners(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingOwners(groupingPath)).toEqual(mockError);
        });
    });

    describe('ownersGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await ownerGroupings();
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await ownerGroupings()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await ownerGroupings()).toEqual(mockError);
        });
    });

    describe('getNumberOfGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getNumberOfGroupings();
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings/count`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await getNumberOfGroupings()).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await getNumberOfGroupings()).toEqual(mockError);
        });
    });

    describe('isSoleOwner', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await isSoleOwner(uhIdentifier, groupingPath);
            expect(fetch)
                .toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`, { headers });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await isSoleOwner(uhIdentifier, groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await isSoleOwner(uhIdentifier, groupingPath)).toEqual(mockError);
        });
    });
});
