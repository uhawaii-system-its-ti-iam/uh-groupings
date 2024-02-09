import { config, middleware } from '@/middleware';
import { createMockSession } from './setupJest';
import { NextRequest, NextResponse } from 'next/server';
import IronSession from 'iron-session';
import User, { AnonymousUser } from '@/access/User';
import Role from '@/access/Role';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

describe('middleware', () => {

    it('should define the config with a list of matching paths', () => {
        expect(config).toBeDefined();
        expect(config.matcher).toBeDefined();
    });

    describe('User is logged-out', () => {

        it('should redirect the user', async () => {
            const redirectSpy = jest.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(undefined));
                await middleware(req);
                expect(redirectSpy).toHaveBeenCalledWith(new URL(baseUrl));

                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(AnonymousUser));
                await middleware(req);
                expect(redirectSpy).toHaveBeenCalledWith(new URL(baseUrl));

                redirectSpy.mockClear();
            }
        });

    });

    describe('User is logged-in', () => {

        afterEach(() => {
            testUser.roles = [];
        })

        it('should redirect the average user at /admin and /groupings', async () => {
            testUser.roles.push(Role.UH);
            const redirectSpy = jest.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(testUser));
                await middleware(req);

                if (matcher === '/admin' || matcher === '/groupings') {
                    expect(redirectSpy).toHaveBeenCalledWith(new URL(baseUrl));
                } else {
                    expect(redirectSpy).not.toHaveBeenCalled();
                }

                redirectSpy.mockClear();
            }
        });

        it('should redirect an owner of a grouping at /admin', async () => {
            testUser.roles.push(Role.OWNER, Role.UH);
            const redirectSpy = jest.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(testUser));
                await middleware(req);

                if (matcher === '/admin') {
                    expect(redirectSpy).toHaveBeenCalledWith(new URL(baseUrl));
                } else {
                    expect(redirectSpy).not.toHaveBeenCalled();
                }

                redirectSpy.mockClear();
            }
        });

        it('should not redirect an admin', async () => {
            testUser.roles.push(Role.ADMIN);
            const redirectSpy = jest.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                jest.spyOn(IronSession, 'getIronSession').mockResolvedValue(createMockSession(testUser));
                await middleware(req);

                expect(redirectSpy).not.toHaveBeenCalled();
                redirectSpy.mockClear();
            }
        });

    });

});
