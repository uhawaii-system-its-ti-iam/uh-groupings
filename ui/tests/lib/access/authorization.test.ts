import { setRoles } from '@/lib/access/authorization';
import Role from '@/lib/access/role';
import User, { AnonymousUser } from '@/lib/access/user';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('authorization', () => {
    describe('setRoles', () => {
        afterEach(() => {
            AnonymousUser.roles = [];
            testUser.roles = [];
        });

        it('should set the ANONYMOUS role', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(false)) // isOwner
                .mockResponseOnce(JSON.stringify(false)); // isAdmin

            await setRoles(AnonymousUser);
            expect(AnonymousUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(AnonymousUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.UH)).toBeFalsy();
        });

        it('should set the UH role', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(false)) // isOwner
                .mockResponseOnce(JSON.stringify(false)); // isAdmin

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH and ADMIN roles', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(false)) // isOwner
                .mockResponseOnce(JSON.stringify(true)); // isAdmin

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeTruthy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH and OWNER roles', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(true)) // isOwner
                .mockResponseOnce(JSON.stringify(false)); // isAdmin

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeTruthy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH, ADMIN, and OWNER roles', async () => {
            fetchMock
                .mockResponseOnce(JSON.stringify(true)) // isOwner
                .mockResponseOnce(JSON.stringify(true)); // isAdmin

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeTruthy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeTruthy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should catch Groupings API errors', async () => {
            fetchMock.mockAbort();

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });
    });
});
