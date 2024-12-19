import { vi, describe, it, expect, afterEach } from 'vitest';
import { config, middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/access/user';
import Role from '@/lib/access/role';
import * as NextCasClient from 'next-cas-client/app';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('next-cas-client/app');

describe('middleware', () => {
    it('should define the config with a list of matching paths', () => {
        expect(config).toBeDefined();
        expect(config.matcher).toBeDefined();
    });

    describe('User is logged-out', () => {
        it('should redirect the user', async () => {
            const redirectSpy = vi.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(null);
                await middleware(req);
                expect(redirectSpy).toHaveBeenCalledWith(new URL(baseUrl));

                redirectSpy.mockClear();
            }
        });
    });

    describe('User is logged-in', () => {
        afterEach(() => {
            testUser.roles = [];
        });

        it('should redirect the average user at /admin and /groupings', async () => {
            testUser.roles.push(Role.UH);
            const redirectSpy = vi.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
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
            const redirectSpy = vi.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
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
            const redirectSpy = vi.spyOn(NextResponse, 'redirect');

            for (const matcher of config.matcher) {
                const url = baseUrl + matcher;
                const req = new NextRequest(new Request(url));

                vi.spyOn(NextCasClient, 'getCurrentUser').mockResolvedValue(testUser);
                await middleware(req);

                expect(redirectSpy).not.toHaveBeenCalled();
                redirectSpy.mockClear();
            }
        });
    });
});
