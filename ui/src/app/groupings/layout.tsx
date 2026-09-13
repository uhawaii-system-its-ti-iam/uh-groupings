import Heading from '@/components/layout/heading';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

const GroupingsLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await setRoles(await getUser());
    if (!(user.roles.includes(Role.OWNER) || user.roles.includes(Role.ADMIN))) redirect('/');

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
