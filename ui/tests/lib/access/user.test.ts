
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Role from '@/lib/access/role';
import User, { AnonymousUser, getUser, loadUser, loadOotbUser } from '@/lib/access/user';
import * as NextCasClient from 'next-cas-client/app';
import * as Fetchers from '@/lib/fetchers';
import { matchProfile, updateActiveDefaultUser } from '@/lib/actions-ootb';
import { OotbActiveProfile } from '@/lib/types';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');
vi.mock('@/lib/fetchers');
vi.mock('@/lib/actions-ootb', () => ({
    matchProfile: vi.fn(),
    updateActiveDefaultUser: vi.fn()
}));


describe('user', () => {
    describe('loadUser', () => {
        testUser.roles = [Role.ANONYMOUS, Role.UH];
        const casUser = {
            user: 'testiwta',
            attributes: {
                cn: 'Testf-iwt-a TestIAM-staff',
                givenName: 'Testf-iwt-a',
                sn: 'TestIAM-staff',
                uid: 'testiwta',
                uhUuid: '99997010'
            }
        };

        it('should return a User', async () => {
            vi.spyOn(Fetchers, 'isOwner').mockResolvedValue(false);
            vi.spyOn(Fetchers, 'isAdmin').mockResolvedValue(false);

            expect(await loadUser(casUser)).toEqual(testUser);
        });
    });

    describe('loadOotbUser', () => {
        it('should return a user with correct roles from OotbActiveProfile', async () => {
            const ootbProfile: OotbActiveProfile = {
                uid: 'admin0123',
                uhUuid: '33333333',
                authorities: ['ROLE_ADMIN', 'ROLE_UH', 'ROLE_OWNER'],
                attributes: {
                    cn: 'ADMIN',
                    mail: 'admin@hawaii.edu',
                    givenName: 'admin',
                    sn: 'AdminLastName'
                },
                groupings: []
            };

            const ootbUser = await loadOotbUser(ootbProfile);
            expect(ootbUser.uid).toBe('admin0123');
            expect(ootbUser.roles.sort()).toEqual([Role.ANONYMOUS, Role.ADMIN, Role.OWNER, Role.UH].sort());
            expect(ootbUser.name).toBe('ADMIN');
            expect(ootbUser.firstName).toBe('admin');
            expect(ootbUser.lastName).toBe('AdminLastName');
        });
    });

    describe('getUser', () => {
        const originalEnv = { ...process.env };

        afterEach(() => {
            process.env = { ...originalEnv };
            vi.resetAllMocks();
        });

        it('should call getCurrentUser', async () => {
            process.env.NEXT_PUBLIC_OOTB_MODE = 'false';

            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);

            expect(await getUser()).toEqual(testUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });
      
        it('should return an AnonymousUser if getCurrentUser is null in normal mode', async () => {
            process.env.NEXT_PUBLIC_OOTB_MODE = 'false';
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(null);

            expect(await getUser()).toEqual(AnonymousUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });

        describe('OOTB mode', () => {
            const ootbProfile: OotbActiveProfile = {
                uid: 'admin0123',
                uhUuid: '33333333',
                authorities: ['ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_UH'],
                attributes: {
                    cn: 'ADMIN',
                    mail: 'admin@hawaii.edu',
                    givenName: 'admin',
                    sn: 'AdminLastName'
                },
                groupings: []
            };

            beforeEach(() => {
                process.env.NEXT_PUBLIC_OOTB_MODE = 'true';
                process.env.NEXT_PUBLIC_OOTB_PROFILE = 'admin';
            });

            it('should return an OOTB user if matchProfile and updateActiveDefaultUser succeed', async () => {
                (matchProfile as vi.Mock).mockResolvedValue(ootbProfile);
                (updateActiveDefaultUser as vi.Mock).mockResolvedValue({ resultCode: 'SUCCESS', result: ootbProfile });

                const ootbUser = await getUser();
                expect(ootbUser.uid).toBe('admin0123');
                expect(ootbUser.roles.sort()).toEqual([Role.ANONYMOUS, Role.ADMIN, Role.OWNER, Role.UH].sort());

                expect(matchProfile).toHaveBeenCalledWith('admin');
                expect(updateActiveDefaultUser).toHaveBeenCalledWith('admin');
            });

            it('should return AnonymousUser if matchProfile cannot find a profile', async () => {
                (matchProfile as vi.Mock).mockRejectedValue(new Error('No profile found for givenName: admin'));

                expect(await getUser()).toEqual(AnonymousUser);
                expect(matchProfile).toHaveBeenCalledWith('admin');
            });

            it('should return AnonymousUser if updateActiveDefaultUser fails', async () => {
                (matchProfile as vi.Mock).mockResolvedValue(ootbProfile);
                (updateActiveDefaultUser as vi.Mock).mockRejectedValue(new Error('Failed to update user'));

                // If we want this test to pass as currently is (returning AnonymousUser),
                // we should not re-throw in the catch block. Instead, we should return AnonymousUser.
                // Let's assume we handle errors gracefully and return AnonymousUser.
                
                expect(await getUser()).toEqual(AnonymousUser);
                expect(updateActiveDefaultUser).toHaveBeenCalledWith('admin');
            });
        });
    });
});