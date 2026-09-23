import { NextRequest } from 'next/server';
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/auth';

export const runtime = 'nodejs';

const basePath = '/uhgroupings';

function rewriteRequest(request: NextRequest): NextRequest {
    const { pathname, search } = request.nextUrl;
    const headers = request.headers;

    const host = headers.get('x-forwarded-host') ?? request.nextUrl.host;
    const proto = headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');

    const prefixedPathname = pathname.startsWith(basePath) ? pathname : `${basePath}${pathname}`;
    const url = new URL(`${proto}://${host}${prefixedPathname}${search}`);
    return new NextRequest(url, request);
}

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
    return handlers.GET(rewriteRequest(request));
}

export async function POST(request: NextRequest) {
    return handlers.POST(rewriteRequest(request));
}
