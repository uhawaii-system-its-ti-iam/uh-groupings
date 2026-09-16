import Heading from '@/components/layout/heading';
import React from 'react';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getUser } from '@/lib/access/user.server';
import { setRoles } from '@/lib/access/authorization';

const AdminLayout = async ({ tab, modals }: { tab: React.ReactNode, modals: React.ReactNode }) => {
    const user = await setRoles(await getUser());
    if (!user.roles.includes(Role.ADMIN)) redirect('/');

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
