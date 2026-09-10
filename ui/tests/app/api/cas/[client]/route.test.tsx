import { vi, it, describe, expect } from 'vitest';
import { GET } from '@/app/api/cas/[client]/route';
import * as NextCasClient from 'next-cas-client/app';
import { NextRequest } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const mockAuthHandler = vi.hoisted(() => vi.fn());

vi.mock('next-cas-client/app', () => ({
    handleAuth: vi.fn(() => mockAuthHandler)
}));

describe('/api/cas/[client]', () => {
    it('should define handleAuth from next-cas-client', async () => {
        const req = new NextRequest(new URL('/api/cas/login?ticket=ticket1', baseUrl));
        await GET(req, { params: Promise.resolve({ client: 'login' }) });

        expect(NextCasClient.handleAuth).toHaveBeenCalled();
        expect(mockAuthHandler).toHaveBeenCalledWith(req, { params: { client: 'login' } });
    });
});
