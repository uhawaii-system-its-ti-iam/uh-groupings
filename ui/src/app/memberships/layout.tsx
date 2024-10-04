import Heading from '@/components/layout/heading';

const MembershipsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Heading
                title="Manage My Memberships"
                description="View and manage my memberships. Search for new groupings to join as a member."
            />
            {children}
        </main>
    );
};

export default MembershipsLayout;
