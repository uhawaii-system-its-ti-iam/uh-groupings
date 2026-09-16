import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '@/app/api/auth/[...all]/route';

const { handlers } = vi.hoisted(() => ({
    handlers: {
        GET: vi.fn(() => NextResponse.json({ method: 'GET' })),
        POST: vi.fn(() => NextResponse.json({ method: 'POST' })),
    },
}));

vi.mock('better-auth/next-js', () => ({ toNextJsHandler: vi.fn(() => handlers) }));
vi.mock('@/auth', () => ({ auth: {} }));

describe('Better Auth Next route', () => {
    it('adds the public base path before passing GET requests to Better Auth', async () => {
        await GET(new NextRequest('http://localhost:8080/api/auth/sign-in?callbackURL=%2Fuhgroupings%2F'));

        expect(handlers.GET).toHaveBeenCalledOnce();
        expect(handlers.GET.mock.calls[0][0].nextUrl.toString())
            .toBe('http://localhost:8080/uhgroupings/api/auth/sign-in?callbackURL=%2Fuhgroupings%2F');
    });

    it('preserves forwarded origin and does not duplicate an existing base path for POST requests', async () => {
        await POST(new NextRequest('http://internal/uhgroupings/api/auth/callback/microsoft', {
            method: 'POST',
            headers: { 'x-forwarded-host': 'groups.example.edu', 'x-forwarded-proto': 'https' },
        }));

        expect(handlers.POST).toHaveBeenCalledOnce();
        expect(handlers.POST.mock.calls[0][0].nextUrl.toString())
            .toBe('https://groups.example.edu/uhgroupings/api/auth/callback/microsoft');
    });
});
