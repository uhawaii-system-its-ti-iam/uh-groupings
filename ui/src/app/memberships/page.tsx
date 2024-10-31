import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {membershipResults, optInGroupingPaths} from '@/lib/fetchers';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from '@/components/table/groupings-table-skeleton';

// Require dynamic import for localStorage
const MembershipsTable = dynamic(() => import('@/app/memberships/_components/memberships-table'), {
    ssr: false,
    loading: () => <GroupingsTableSkeleton />
});

const Memberships = async () => {
    const { results } = await membershipResults();
    const { groupingPaths } = await optInGroupingPaths()
    const result = await optInGroupingPaths()
    console.log(result)
    return (
        <Tabs className="bg-seafoam" defaultValue="current-memberships">
            <div className="container">
                <TabsList variant="outline">
                    <TabsTrigger value="current-memberships" variant="outline">
                        Current Memberships
                    </TabsTrigger>
                    <TabsTrigger value="membership-opportunities" variant="outline">
                        Membership Opportunities
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="current-memberships">
                <div className="bg-white">
                    <div className="container">
                        <MembershipsTable results={results} isOptOut={true}/>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="membership-opportunities">
                <div className="bg-white">
                    <div className="container">
                        <MembershipsTable results={groupingPaths} isOptOut={false}/>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default Memberships;
