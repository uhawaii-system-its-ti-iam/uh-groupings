import { vi, it, describe, expect } from 'vitest';
import { GET } from '@/app/api/cas/[client]/route';
import * as NextCasClient from 'next-cas-client/app';
import { NextRequest } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

vi.mock('next-cas-client/app', () => ({
    handleAuth: vi.fn(() => vi.fn())
}));

describe('/api/cas/[client]', () => {
    it('should define handleAuth from next-cas-client', async () => {
        const req = new NextRequest(new URL('/api/cas/login?ticket=ticket1', baseUrl));
        await GET(req, { params: { client: 'login' } });

        expect(NextCasClient.handleAuth).toHaveBeenCalled();
    });
});
