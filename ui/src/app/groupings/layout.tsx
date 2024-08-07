import Heading from '@/components/layout/heading';

const GroupingsLayout = ({ children }: { children: React.ReactNode }) => {
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
