'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MembershipsTabLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    return (
        <>
            <Tabs
                className="bg-seafoam"
                value={
                    pathname.includes('/memberships/opportunities') ? 'membership-opportunities' : 'current-memberships'
                }
            >
                <div className="container">
                    <TabsList variant="outline">
                        <Link href="/memberships/current">
                            <TabsTrigger value="current-memberships" variant="outline">
                                Current Memberships
                            </TabsTrigger>
                        </Link>
                        <Link href="/memberships/opportunities">
                            <TabsTrigger value="membership-opportunities" variant="outline">
                                Membership Opportunities
                            </TabsTrigger>
                        </Link>
                    </TabsList>
                </div>
                {children}
            </Tabs>
        </>
    );
};

export default MembershipsTabLayout;
