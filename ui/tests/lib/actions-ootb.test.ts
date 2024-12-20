import { vi, describe, beforeAll, it, expect, beforeEach } from 'vitest';
import { updateActiveDefaultUser, matchProfile } from '@/lib/actions-ootb';
import * as NextCasClient from 'next-cas-client/app';
import User from '@/lib/access/user';
import ootbProfiles from '../../ootb.active.user.profiles.json' assert { type: 'json' };

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

const testUser: User = {
    ...JSON.parse(process.env.TEST_USER_A as string),
    uid: 'admin0123'
};

vi.mock('next-cas-client/app');

describe('actions-ootb', () => {
    const currentUser = testUser;
    const givenName = 'admin';

    const testProfile = {
        uid: 'admin0123',
        uhUuid: '33333333',
        authorities: ['ROLE_ADMIN', 'ROLE_UH', 'ROLE_OWNER'],
        attributes: { cn: 'ADMIN', mail: 'admin@hawaii.edu', givenName: 'admin' },
        groupings: [
            {
                name: 'shared-group-in-each-profile:basis',
                displayName: 'shared-group-in-each-profile:basis',
                extension: 'basis',
                displayExtension: 'basis',
                description: 'This is a shared group in each profile',
                members: [
                    { name: 'shared-owner-3', uhUuid: '29382734', uid: 'sowner3' },
                    { name: 'MemberUser', uhUuid: '11111111', uid: 'member0123' }
                ]
            },
            {
                name: 'shared-group-in-groupings:owners',
                displayName: 'shared-group-in-groupings:owners',
                extension: 'owners',
                displayExtension: 'owners',
                description: 'This is a shared group in admin user groupings',
                members: [
                    { name: 'AdminUser', uid: 'admin0123', uhUuid: '33333333' },
                    { name: 'OwnerUser', uid: 'owner0123', uhUuid: '22222222' }
                ]
            },
            {
                name: 'shared-group-in-each-profile:owners',
                displayName: 'shared-group-in-each-profile:owners',
                extension: 'owners',
                displayExtension: 'owners',
                description: 'This is a shared group in each profile',
                members: [
                    { name: 'shared-owner-3', uhUuid: '29382734', uid: 'sowner3' }
                ]
            },
            {
                name: 'admin-include:owners',
                displayName: 'admin-include:owners',
                extension: 'owners',
                displayExtension: 'owners',
                description: 'Admin owned include group',
                members: []
            },
            {
                name: 'admin-include:include',
                displayName: 'admin-include:include',
                extension: 'include',
                displayExtension: 'include',
                description: 'Admin owned include group',
                members: [
                    { name: 'AdminUser', uid: 'admin0123', uhUuid: '33333333' }
                ]
            },
            {
                name: 'admin-group:owners',
                displayName: 'admin-group:owners',
                extension: 'owners',
                displayExtension: 'owners',
                description: 'Admin owned group',
                members: []
            },
            {
                name: 'owner-complex:owners',
                displayName: 'Owner-Complex: Owners',
                extension: 'owners',
                displayExtension: 'Owners',
                description: "Owner's owned complex group",
                members: [
                    { name: 'complex-member1', uhUuid: '32532314', uid: 'cmember1' },
                    { name: 'complex-member2', uhUuid: '87453218', uid: 'cmember2' },
                    { name: 'complex-member3', uhUuid: '56473829', uid: 'cmember3' },
                    { name: 'complex-member4', uhUuid: '45261378', uid: 'cmember4' },
                    { name: 'complex-member5', uhUuid: '98765432', uid: 'cmember5' },
                    { name: 'complex-member6', uhUuid: '12345678', uid: 'cmember6' },
                    { name: 'complex-member7', uhUuid: '19283746', uid: 'cmember7' },
                    { name: 'complex-member8', uhUuid: '72635489', uid: 'cmember8' },
                    { name: 'complex-member9', uhUuid: '65432109', uid: 'cmember9' },
                    { name: 'complex-member10', uhUuid: '01234567', uid: 'cmember10' }
                ]
            }
        ]
    };

    const mockResponse = {
        resultCode: 'SUCCESS',
        result: testProfile
    };

    const mockError = { resultCode: 'FAILURE' };

    beforeAll(() => {
        vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
    });

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    describe('matchProfile', () => {
        it('should return a profile when a matching givenName is found', async () => {
            (ootbProfiles as any[]).push(testProfile);
            const res = await matchProfile(givenName);
            expect(res).toEqual(testProfile);
            (ootbProfiles as any[]).pop();
        });

        it('should throw an error if no matching profile is found', async () => {
            const nonExistentName = 'NonExistent';
            await expect(matchProfile(nonExistentName)).rejects.toThrow(
                `No profile found for givenName: ${nonExistentName}`
            );
        });
    });

    describe('updateActiveDefaultUser', () => {
        it('should make a POST request at the correct endpoint with the matched profile and handle the successful response', async () => {
            (ootbProfiles as any[]).push(testProfile);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
            const res = await updateActiveDefaultUser(givenName);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/activeProfile/ootb`, expect.objectContaining({
                method: 'POST',
                headers: {
                    current_user: currentUser.uid,
                    'Content-Type': 'application/json'
                }
            }));
            const [_, options] = fetchMock.mock.calls[0];
            const sentBody = JSON.parse((options as RequestInit).body as string);
            expect(sentBody).toEqual(testProfile);
            expect(res).toEqual(mockResponse);
            (ootbProfiles as any[]).pop();
        });

        it('should handle an error when profile is not found', async () => {
            fetchMock.mockReject(() => Promise.reject(mockError));
            await expect(updateActiveDefaultUser('DoesNotExist')).rejects.toThrow(
                'No profile found for givenName: DoesNotExist'
            );
        });
    });
});