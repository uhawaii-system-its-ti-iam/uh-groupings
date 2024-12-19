import User from '@/lib/access/user';
import {
    getAllGroupings,
    getAnnouncements,
    getNumberOfGroupings,
    getNumberOfMemberships,
    groupingAdmins,
    groupingDescription,
    groupingOptAttributes,
    groupingOwners,
    groupingSyncDest,
    isAdmin,
    isOwner,
    isSoleOwner,
    managePersonResults,
    membershipResults,
    optInGroupingPaths,
    ownedGrouping,
    ownerGroupings
} from '@/lib/fetchers';
import * as NextCasClient from 'next-cas-client/app';
import * as Actions from '@/lib/actions';
import { vi, describe, beforeAll, it, expect, beforeEach, afterEach } from 'vitest';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');
vi.mock('@/lib/actions');

describe('fetchers', () => {
    const currentUser = testUser;

    const uhIdentifier = 'testiwta';
    const groupingPath = 'tmp:testiwta:testiwta-aux';
    const groupPaths = [
        `${groupingPath}:include`,
        `${groupingPath}:include`,
        `${groupingPath}:exclude`,
        `${groupingPath}:owners`
    ];

    const mockResponse = {
        resultCode: 'SUCCESS'
    };
    const mockError = {
        resultCode: 'FAILURE'
    };

    beforeAll(() => {
        vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
        vi.spyOn(Actions, 'sendStackTrace');
    });

    describe('getAllGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getAllGroupings();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings`, {
                headers: { current_user: currentUser.uid }
            });
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

    describe('getAnnouncements', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getAnnouncements();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/announcements`, {
                headers: { current_user: '' }
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
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should make a POST request at the correct endpoint', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            await ownedGrouping(groupPaths, page, size, sortString, isAscending);
            expect(fetch).toHaveBeenCalledWith(
                `${baseUrl}/groupings/group?` +
                    `page=${page}&size=${size}&sortString=${sortString}&isAscending=${isAscending}`,
                {
                    body: JSON.stringify(groupPaths),
                    headers: {
                        current_user: currentUser.uid,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }
            );
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await ownedGrouping(groupPaths, page, size, sortString, isAscending)).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            let res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await vi.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await vi.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);

            fetchMock
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse), { status: 500 })
                .mockResponseOnce(JSON.stringify(mockResponse));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await vi.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockError), { status: 500 });
            let res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await vi.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);

            fetchMock.mockReject(() => Promise.reject(mockError));
            res = ownedGrouping(groupPaths, page, size, sortString, isAscending);
            await vi.advanceTimersByTimeAsync(5000);
            expect(await res).toEqual(mockError);
        });
    });

    describe('groupingDescription', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingDescription(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/groupings-sync-destinations`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/opt-attributes`, {
                headers: { current_user: currentUser.uid }
            });
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

    describe('groupingAdmins', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingAdmins();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/admins`, {
                headers: { current_user: currentUser.uid }
            });
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

    describe('membershipResults', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await membershipResults();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${currentUser.uid}/memberships`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${uhIdentifier}/groupings`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${currentUser.uid}/memberships/count`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/members/${currentUser.uid}/opt-in-groups`, {
                headers: { current_user: currentUser.uid }
            });
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

    describe('groupingOwners', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingOwners(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/grouping/${groupingPath}/owners`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/owners/${currentUser.uid}/groupings/count`, {
                headers: { current_user: currentUser.uid }
            });
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/owners/${uhIdentifier}`, {
                headers: { current_user: currentUser.uid }
            });
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

    describe('isOwner', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await isOwner(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/owners`, {
                headers: { current_user: currentUser.uid }
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await isOwner(uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await isOwner(uhIdentifier)).toEqual(mockError);
        });
    });

    describe('isAdmin', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await isAdmin(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/admins`, {
                headers: { current_user: currentUser.uid }
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await isAdmin(uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await isAdmin(uhIdentifier)).toEqual(mockError);
        });
    });
});
