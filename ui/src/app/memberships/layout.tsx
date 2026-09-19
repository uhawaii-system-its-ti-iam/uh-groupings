import Heading from '@/components/layout/heading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Membership'
};

const MembershipsLayout = ({ tab }: { tab: React.ReactNode }) => {
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
