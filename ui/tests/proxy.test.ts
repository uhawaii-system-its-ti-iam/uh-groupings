import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

describe('authentication proxy', () => {
    it('sends an unauthenticated protected request to login with its destination', () => {
        const response = proxy(new NextRequest('http://localhost:8080/groupings/test-grouping?tab=members'));

        expect(response?.headers.get('location')).toBe(
            'http://localhost:8080/uhgroupings/?callbackURL=%2Fuhgroupings%2Fgroupings%2Ftest-grouping%3Ftab%3Dmembers'
        );
    });

    it('permits a request that has a Better Auth session cookie', () => {
        const request = new NextRequest('http://localhost:8080/admin', {
            headers: { cookie: 'better-auth.session_token=session' }
        });

        expect(proxy(request)).toBeUndefined();
    });
});
