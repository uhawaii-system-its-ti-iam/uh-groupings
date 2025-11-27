import User from '@/lib/access/user';
import {
    getAllGroupings,
    getAnnouncements,
    getNumberOfGroupings,
    getNumberOfMemberships,
    groupingAdmins,
    groupingDescription,
    groupingOptAttributes,
    groupingSyncDest,
    isAdmin,
    isOwner,
    isGroupingOwner,
    isSoleOwner,
    managePersonResults,
    membershipResults,
    optInGroupingPaths,
    ownerGroupings,
    groupingPathIsValid,
    groupingOwners
} from '@/lib/fetchers';
import * as NextCasClient from 'next-cas-client/app';
import * as Actions from '@/lib/actions';
import { vi, describe, beforeAll, it, expect } from 'vitest';
import * as JwtService from '@/lib/jwt-service';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');
vi.mock('@/lib/actions');

describe('fetchers', () => {
    const currentUser = testUser;
    let authToken: string;

    const uhIdentifier = 'testiwta';
    const groupingPath = 'tmp:testiwta:testiwta-aux';

    const mockResponse = {
        resultCode: 'SUCCESS'
    };
    const mockError = {
        resultCode: 'FAILURE'
    };

    beforeAll(async () => {
        vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
        vi.spyOn(Actions, 'sendStackTrace');
        authToken = await JwtService.generateJWT();
        // Mock generateJWT to always return the same token for consistent test assertions
        vi.spyOn(JwtService, 'generateJWT').mockResolvedValue(authToken);
    });

    describe('getAllGroupings', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await getAllGroupings();
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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

    describe('groupingDescription', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingDescription(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/groupings/${groupingPath}/description`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/memberships`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/memberships/count`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/owners/groupings`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/owners/groupings/count`, {
                headers: { Authorization: `Bearer ${authToken}` }
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
                headers: { Authorization: `Bearer ${authToken}` }
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
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${uhIdentifier}/is-owner`, {
                headers: { Authorization: `Bearer ${authToken}` }
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

    describe('isGroupingOwner', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await isGroupingOwner(groupingPath, uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${groupingPath}/${uhIdentifier}/is-owner`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await isGroupingOwner(groupingPath, uhIdentifier)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await isGroupingOwner(groupingPath, uhIdentifier)).toEqual(mockError);
        });
    });

    describe('isAdmin', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await isAdmin(uhIdentifier);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/members/${uhIdentifier}/is-admin`, {
                headers: { Authorization: `Bearer ${authToken}` }
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

    describe('groupingPathIsValid', () => {
        it('should make a GET request at the correct endpoint', async () => {
            await groupingPathIsValid(groupingPath);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/grouping/${groupingPath}/is-valid`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
        });

        it('should handle the successful response', async () => {
            fetchMock.mockResponse(JSON.stringify(mockResponse));
            expect(await groupingPathIsValid(groupingPath)).toEqual(mockResponse);
        });

        it('should handle the error response', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            expect(await groupingPathIsValid(groupingPath)).toEqual(mockError);
        });
    });
});
