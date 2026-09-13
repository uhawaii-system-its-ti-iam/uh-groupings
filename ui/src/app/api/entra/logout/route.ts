import { NextRequest, NextResponse } from 'next/server';

/**
 * Completes RP-initiated logout after the browser has cleared its local
 * Better Auth cookie. Keeping this server-side avoids publishing the tenant
 * configuration to every client bundle.
 */
export function GET(request: NextRequest) {
    const tenantId = process.env.ENTRA_TENANT_ID;

    if (!tenantId) {
        return NextResponse.redirect(new URL('/uhgroupings/', request.url));
    }

    const postLogoutRedirectUri = new URL('/uhgroupings/', request.url).toString();
    const logoutUrl = new URL(
        `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/logout`
    );
    logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);

    return NextResponse.redirect(logoutUrl);
}
