import GroupingsHeading from '@/components/layout/groupings-heading';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getAuthorizedUser } from '@/lib/access/user.server';

export const metadata: Metadata = {
    title: 'Owners'
};

const GroupingsLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getAuthorizedUser();
    if (!user.roles.includes(Role.ADMIN) && !user.roles.includes(Role.OWNER)) redirect('/');

    return (
        <>
            <Suspense fallback={null}>
                <GroupingsHeading />
            </Suspense>
            {children}
        </>
    );
};

export default GroupingsLayout;
