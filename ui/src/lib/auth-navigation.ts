const appBasePath = '/uhgroupings';

/** Returns an in-app callback URL only, preventing OAuth open redirects. */
export function getSafeCallbackURL(value?: string | null): string {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return `${appBasePath}/`;
    }

    const url = new URL(value, 'https://uhgroupings.invalid');
    if (url.origin !== 'https://uhgroupings.invalid' || (url.pathname !== appBasePath && !url.pathname.startsWith(`${appBasePath}/`))) {
        return `${appBasePath}/`;
    }

    return `${url.pathname}${url.search}${url.hash}`;
}

/** Gets the originally requested in-app page, if middleware supplied one. */
export function getLoginCallbackURL(currentURL: string): string {
    const url = new URL(currentURL, 'https://uhgroupings.invalid');
    return getSafeCallbackURL(url.searchParams.get('callbackURL') ?? `${url.pathname}${url.search}`);
}

export function isProtectedPath(pathname: string): boolean {
    return ['/admin', '/memberships', '/groupings', '/feedback'].some(
        (route) => pathname === `${appBasePath}${route}` || pathname.startsWith(`${appBasePath}${route}/`)
    );
}
