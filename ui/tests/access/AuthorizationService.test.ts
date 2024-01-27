import { setRoles } from '@/access/AuthorizationService';
import Role from '@/access/Role';
import User, { AnonymousUser } from '@/access/User';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);
const apiBaseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

describe('AuthorizationService', () => {
    
    describe('setRoles', () => {

        let axiosMock: MockAdapter;

        beforeEach(() => {
            axiosMock = new MockAdapter(axios);
        });

        afterEach(() => {
            AnonymousUser.roles = [];
            testUser.roles = [];
        });

        it('should set the ANONYMOUS role', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(200, false);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(200, false);

            await setRoles(AnonymousUser);
            expect(AnonymousUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(AnonymousUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(AnonymousUser.roles.includes(Role.UH)).toBeFalsy();
        });

        it('should set the UH role', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(200, false);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(200, false);

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH and ADMIN roles', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(200, false);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(200, true);

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeTruthy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH and OWNER roles', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(200, true);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(200, false);

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeTruthy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should set the UH, ADMIN, and OWNER roles', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(200, true);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(200, true);

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeTruthy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeTruthy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

        it('should catch Groupings API errors', async () => {
            axiosMock.onGet(`${apiBaseUrl}/owners`).reply(500);
            axiosMock.onGet(`${apiBaseUrl}/admins`).reply(500);

            await setRoles(testUser);
            expect(testUser.roles.includes(Role.ADMIN)).toBeFalsy();
            expect(testUser.roles.includes(Role.ANONYMOUS)).toBeTruthy();
            expect(testUser.roles.includes(Role.OWNER)).toBeFalsy();
            expect(testUser.roles.includes(Role.UH)).toBeTruthy();
        });

    });

});
