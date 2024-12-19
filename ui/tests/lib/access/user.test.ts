import { vi, describe, it, expect } from 'vitest';
import Role from '@/lib/access/role';
import User, { AnonymousUser, getUser, loadUser } from '@/lib/access/user';
import * as NextCasClient from 'next-cas-client/app';
import * as Fetchers from '@/lib/fetchers';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');
vi.mock('@/lib/fetchers');

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

    describe('getUser', () => {
        it('should call getCurrentUser', async () => {
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);

            expect(await getUser()).toEqual(testUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });

        it('should return an AnonymousUser if getCurrentUser is null', async () => {
            vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(null);

            expect(await getUser()).toEqual(AnonymousUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });
    });
});
