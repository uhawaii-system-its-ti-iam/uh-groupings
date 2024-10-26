import Heading from '@/components/layout/heading';

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
