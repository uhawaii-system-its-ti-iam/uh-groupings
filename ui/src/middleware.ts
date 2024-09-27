import { NextResponse, NextRequest } from 'next/server';
import Role from '@/lib/access/role';
import { AnonymousUser, getUser } from './lib/access/user';

/**
 * Next.js middleware function that is called upon visiting a route that matches the config.
 *
 * @param req - The request object
 */
export const middleware = async (req: NextRequest) => {
    const currentUser = await getUser();
    if (currentUser === AnonymousUser) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
    if (req.url.endsWith('/admin') && !currentUser.roles.includes(Role.ADMIN)) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
    if (
        req.url.endsWith('/groupings') &&
        !(currentUser.roles.includes(Role.OWNER) || currentUser.roles.includes(Role.ADMIN))
    ) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
};

export const config = {
    matcher: ['/admin', '/memberships', '/groupings', '/feedback']
};
