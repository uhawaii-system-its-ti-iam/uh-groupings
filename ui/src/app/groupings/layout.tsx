import Heading from '@/components/layout/heading';
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
            <Heading
                title="Manage My Groupings"
                description="View and manage groupings I own. Manage members, 
                        configure grouping options and sync destinations."
            />
            {children}
        </>
    );
};

export default GroupingsLayout;
