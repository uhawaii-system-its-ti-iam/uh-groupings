import Heading from '@/components/layout/heading';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Heading
                title="UH Groupings Administration"
                description="Search for and manage any grouping on behalf of its
                        owner. Manage the list of UH Groupings administrators."
            />
            {children}
        </main>
    );
};

export default AdminLayout;
