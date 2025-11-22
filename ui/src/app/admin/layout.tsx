import Heading from '@/components/layout/heading';
import React from 'react';

const AdminLayout = ({ tab, modals }: { tab: React.ReactNode, modals: React.ReactNode }) => {
    return (
        <>
            <main>
                <Heading
                    title="UH Groupings Administration"
                    description="Search for and manage any grouping on behalf of its
                        owner. Manage the list of UH Groupings administrators."
                />
                {tab}
            </main>
            <div id="modals">{modals}</div>

        </>
    );
};

export default AdminLayout;
