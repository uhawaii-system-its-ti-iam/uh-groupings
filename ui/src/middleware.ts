import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, SessionOptions } from './access/Session';
import Role from './access/Role';
import { isDeepStrictEqual } from 'util';
import { AnonymousUser } from './access/User';

/**
 * Next.js middleware function that is called upon visiting a route that matches the config.
 * 
 * @param req - The request object
 */
export const middleware = async (req: NextRequest) => {
    const session = await getIronSession<SessionData>(cookies(), SessionOptions);
    
    const { user } = session;
    if (!user || isDeepStrictEqual(user, AnonymousUser)) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
    if (req.url.endsWith('/admin') && !user.roles.includes(Role.ADMIN)) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
    if (req.url.endsWith('/groupings') && !(user.roles.includes(Role.OWNER) || user.roles.includes(Role.ADMIN))) {
        return NextResponse.redirect(new URL('/uhgroupings', req.url));
    }
};
  
export const config = {
    matcher: ['/admin', '/memberships', '/groupings', '/feedback']
};
