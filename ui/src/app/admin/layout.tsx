import Heading from '@/components/layout/heading';
import { sectionHeadings } from '@/components/layout/section-headings';
import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Role from '@/lib/access/role';
import { getAuthorizedUser } from '@/lib/access/user.server';

export const metadata: Metadata = {
    title: 'Admin'
};

const AdminLayout = async ({ tab, modals }: { tab: React.ReactNode; modals: React.ReactNode }) => {
    const user = await getAuthorizedUser();
    if (!user.roles.includes(Role.ADMIN)) redirect('/');

    return (
        <>
            <main>
                <Heading {...sectionHeadings.admin} />
                {tab}
            </main>
            <div id="modals">{modals}</div>
        </>
    );
};

export default AdminLayout;
