import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
/*import {getAllGroupings} from '@/lib/fetchers';*/
import {ownerGroupings} from '@/lib/fetchers';
//import {groupingAdmins} from '@/lib/fetchers';
//import AdminTable from '@/components/table/adminTable/AdminTable';
import dynamic from 'next/dynamic';
import GroupingsTableSkeleton from '@/components/table/groupingsTable/groupings-table-skeleton';

// Require dynamic import for localStorage
const GroupingsTable = dynamic(() => import('@/components/table/groupingsTable/groupings-table'), {
  ssr: false,
  loading: () => <GroupingsTableSkeleton />
});

const Admin = async () => {
    /*const groupingRes = await getAllGroupings();
    const groupingPaths = groupingRes.groupingPaths;
    const adminRes = await groupingAdmins();
    const members = adminRes.members;*/

    /*const { groupingPaths } = await getAllGroupings();*/
    const { groupingPaths } = await ownerGroupings();

    return (
        <main>
            <div className="bg-seafoam pt-3">
                <Tabs defaultValue="manage-groupings">
                    <div className="container">
                        <TabsList variant="outline">
                            <TabsTrigger
                                value="manage-groupings" variant="outline" >
                                Manage Groupings
                            </TabsTrigger>
                            <TabsTrigger
                                value="manage-admins" variant="outline" >
                                Manage Admins
                            </TabsTrigger>
                            <TabsTrigger
                                value="manage-person" variant="outline" >
                                Manage Person
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="manage-groupings">
                        <div className="bg-white">
                            <div className="container">
                                <GroupingsTable groupingPaths = {groupingPaths}/>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="manage-admins">
                        <div className="bg-white">
                            <div className="container">
                                {/*<AdminTable data={members}/>*/}
                                {/*<AddAdmin/>*/}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="manage-person">
                        <div className="bg-white">
                            <div className="container">
                                {/* PersonTable goes here */}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

export default Admin;
