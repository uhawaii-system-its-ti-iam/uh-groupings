import Heading from '@/components/layout/heading';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getAuthorizedUser } from '@/lib/access/user.server';

export const metadata: Metadata = {
    title: 'Membership'
};

const MembershipsLayout = async ({ tab }: { tab: React.ReactNode }) => {
    const user = await getAuthorizedUser();
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
