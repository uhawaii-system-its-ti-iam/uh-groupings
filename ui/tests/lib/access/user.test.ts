import Role from '@/lib/access/role';
import User, { AnonymousUser, getUser, loadUser } from '@/lib/access/user';
import * as NextCasClient from 'next-cas-client/app';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

jest.mock('next-cas-client/app');

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
            fetchMock
                .mockResponseOnce(JSON.stringify(false)) // isOwner
                .mockResponseOnce(JSON.stringify(false)); // isAdmin

            expect(await loadUser(casUser)).toEqual(testUser);
        });
    });

    describe('getUser', () => {
        it('should call getCurrentUser', async () => {
            jest.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);

            expect(await getUser()).toEqual(testUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });

        it('should return an AnonymousUser if getCurrentUser is null', async () => {
            jest.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(null);

            expect(await getUser()).toEqual(AnonymousUser);
            expect(NextCasClient.getCurrentUser).toHaveBeenCalled();
        });
    });
});
