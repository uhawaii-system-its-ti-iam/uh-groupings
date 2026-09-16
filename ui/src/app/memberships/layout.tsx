import Heading from '@/components/layout/heading';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

const MembershipsLayout = async ({ tab }: { tab: React.ReactNode }) => {
    const user = await setRoles(await getUser());
    if (!user.roles.includes(Role.UH)) redirect('/');

    return (
        <main>
            <Heading
                title="Manage My Memberships"
                description="View and manage my memberships. Search for new groupings to join as a member."
            />
            {tab}
        </main>
    );
};

export default MembershipsLayout;
