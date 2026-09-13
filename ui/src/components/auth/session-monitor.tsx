'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { isProtectedPath } from '@/lib/auth-navigation';

/** Keeps an open tab in sync with the Better Auth application session. */
const SessionMonitor = () => {
    const { data: session, isPending, error } = authClient.useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isPending || error || session || !isProtectedPath(pathname)) return;

        const destination = `${pathname}${window.location.search}`;
        router.replace(`/uhgroupings/?callbackURL=${encodeURIComponent(destination)}`);
    }, [error, isPending, pathname, router, session]);

    return null;
};

export default SessionMonitor;
