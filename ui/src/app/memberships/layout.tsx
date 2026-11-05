import Heading from '@/components/layout/heading';
import { sectionHeadings } from '@/components/layout/section-headings';
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
            <Heading {...sectionHeadings.memberships} />
            {tab}
        </main>
    );
};

export default MembershipsLayout;
