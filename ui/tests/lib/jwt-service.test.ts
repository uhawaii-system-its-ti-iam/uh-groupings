import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import * as jwt from 'jsonwebtoken';
import * as UserAccess from '@/lib/access/user';
import User from '@/lib/access/user';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

vi.mock('@/lib/access/user');

describe('jwt-service', () => {
    let generateJWT: () => Promise<string>;

    beforeEach(async () => {
        vi.spyOn(UserAccess, 'getUser').mockResolvedValue(testUser);
        vi.resetModules();
        const jwtService = await import('@/lib/jwt-service');
        generateJWT = jwtService.generateJWT;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('generateJWT', () => {
        it('should generate a valid JWT token', async () => {
            const token = await generateJWT();

            expect(token).toBeTruthy();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        it('should include the user uid in the token payload as sub', async () => {
            const token = await generateJWT();
            const decoded = jwt.decode(token) as any;

            expect(decoded.sub).toBe(testUser.uid);
        });

        it('should include the user roles in the token payload', async () => {
            const token = await generateJWT();
            const decoded = jwt.decode(token) as any;

            expect(decoded.roles).toEqual(testUser.roles);
        });

        it('should set expiration time based on JWT_EXPIRATION_SECONDS', async () => {
            const token = await generateJWT();
            const decoded = jwt.decode(token) as any;

            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();

            const expiresIn = decoded.exp - decoded.iat;
            expect(expiresIn).toBeGreaterThan(0);
        });

        it('should use HS256 algorithm', async () => {
            const token = await generateJWT();
            const decoded = jwt.decode(token, { complete: true }) as any;

            expect(decoded.header.alg).toBe('HS256');
        });

        it('should generate different tokens when called multiple times', async () => {
            const token1 = await generateJWT();
            await new Promise(resolve => setTimeout(resolve, 1100));
            const token2 = await generateJWT();

            expect(token1).not.toBe(token2);

            const decoded1 = jwt.decode(token1) as any;
            const decoded2 = jwt.decode(token2) as any;

            expect(decoded1.sub).toBe(decoded2.sub);
            expect(decoded1.roles).toEqual(decoded2.roles);
            expect(decoded1.iat).not.toBe(decoded2.iat);
        });

        it('should throw error if JWT_SECRET_KEY is not set', async () => {
            const originalSecret = process.env.JWT_SECRET_KEY;
            delete process.env.JWT_SECRET_KEY;

            vi.resetModules();
            const jwtService = await import('@/lib/jwt-service');

            await expect(jwtService.generateJWT()).rejects.toThrow('JWT_SECRET_KEY environment variable is not set');

            process.env.JWT_SECRET_KEY = originalSecret;
        });

        it('should throw error if JWT_EXPIRATION_SECONDS is not set', async () => {
            const originalExpiration = process.env.JWT_EXPIRATION_SECONDS;
            delete process.env.JWT_EXPIRATION_SECONDS;

            vi.resetModules();
            const jwtService = await import('@/lib/jwt-service');

            await expect(jwtService.generateJWT()).rejects.toThrow('JWT_EXPIRATION_SECONDS environment variable is not set');

            process.env.JWT_EXPIRATION_SECONDS = originalExpiration;
        });
    });
});
