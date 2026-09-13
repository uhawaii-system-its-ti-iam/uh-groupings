import { NextResponse, NextRequest } from 'next/server';

const sessionCookieNames = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token'
];

/**
 * Next.js middleware function that is called upon visiting a route that matches the config.
 *
 * @param req - The request object
 */
export const middleware = (req: NextRequest) => {
    // Middleware always runs in Next's Edge runtime, so we can use the `req.cookies` API to check for the presence of session cookies.
    const hasSessionCookie = sessionCookieNames.some((name) => req.cookies.has(name));

    if (!hasSessionCookie) {
        const loginURL = new URL('/uhgroupings/', req.url);
        // Next removes basePath before middleware matching, so restore it for
        // the browser-visible callback URL.
        const pathname = req.nextUrl.pathname.startsWith('/uhgroupings/')
            ? req.nextUrl.pathname
            : `/uhgroupings${req.nextUrl.pathname}`;
        loginURL.searchParams.set('callbackURL', `${pathname}${req.nextUrl.search}`);
        return NextResponse.redirect(loginURL);
    }
};

export const config = {
    matcher: ['/admin', '/memberships', '/groupings', '/feedback']
};
