'use client';

import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';

const AdminTabsLayout = ({ children }: { children: React.ReactNode }) => {
    const currentPath = usePathname().split('/').pop();
    return (
        <>
            <Tabs className="bg-seafoam" value={currentPath === 'admin' ? 'manage-groupings' : currentPath.toString()}>
                <div className="container">
                    <TabsList variant="outline">
                        <Link key={'groupings'} href={`/admin/manage-groupings`}>
                            <TabsTrigger value="manage-groupings" variant="outline">
                                Manage Groupings
                            </TabsTrigger>
                        </Link>
                        <Link key={'admins'} href={'/admin/manage-admins'}>
                            <TabsTrigger value="manage-admins" variant="outline">
                                Manage Admins
                            </TabsTrigger>
                        </Link>
                        <Link key={'person'} href={'/admin/manage-person'}>
                            <TabsTrigger value="manage-person" variant="outline">
                                Manage Person
                            </TabsTrigger>
                        </Link>
                    </TabsList>
                </div>
            </Tabs>
            {children}
        </>
    );
};

export default AdminTabsLayout;
