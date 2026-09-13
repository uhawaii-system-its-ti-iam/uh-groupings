import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/entra/logout/route';

const originalTenant = process.env.ENTRA_TENANT_ID;

afterEach(() => {
    if (originalTenant === undefined) delete process.env.ENTRA_TENANT_ID;
    else process.env.ENTRA_TENANT_ID = originalTenant;
    vi.restoreAllMocks();
});

describe('Entra logout route', () => {
    it('returns home when no private tenant configuration is available', () => {
        delete process.env.ENTRA_TENANT_ID;
        const response = GET(new NextRequest('http://localhost:8080/uhgroupings/api/entra/logout'));

        expect(response.headers.get('location')).toBe('http://localhost:8080/uhgroupings/');
    });

    it('redirects to Entra with a post-logout application URL', () => {
        process.env.ENTRA_TENANT_ID = 'tenant/with space';
        const response = GET(new NextRequest('https://groups.example.edu/uhgroupings/api/entra/logout'));
        const location = new URL(response.headers.get('location')!);

        expect(location.origin).toBe('https://login.microsoftonline.com');
        expect(location.pathname).toBe('/tenant%2Fwith%20space/oauth2/v2.0/logout');
        expect(location.searchParams.get('post_logout_redirect_uri')).toBe('https://groups.example.edu/uhgroupings/');
    });
});
