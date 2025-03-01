import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
//TODO: import { getAllGroupings, groupingAdmins } from '@/lib/fetchers';
import { groupingAdmins, ownerGroupings } from '@/lib/fetchers';
import GroupingsTable from '@/components/table/groupings-table/groupings-table';
import AdminTable from '@/app/admin/_components/admin-table/admin-table';

const Admin = async () => {
    //TODO: const { groupingPaths } = await getAllGroupings();
    const { groupingPaths } = await ownerGroupings();
    const groupingGroupMembers = await groupingAdmins();

    return (
        <main>
            <div className="bg-seafoam pt-3">
                <Tabs defaultValue="manage-groupings">
                    <div className="container">
                        <TabsList variant="outline">
                            <TabsTrigger value="manage-groupings" variant="outline">
                                Manage Groupings
                            </TabsTrigger>
                            <TabsTrigger value="manage-admins" variant="outline">
                                Manage Admins
                            </TabsTrigger>
                            <TabsTrigger value="manage-person" variant="outline">
                                Manage Person
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="manage-groupings">
                        <div className="bg-white">
                            <div className="container">
                                <GroupingsTable groupingPaths={groupingPaths} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="manage-admins">
                        <div className="bg-white">
                            <div className="container">
                                <AdminTable groupingGroupMembers = {groupingGroupMembers} />
                                {/*<AddAdmin/>*/}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="manage-person">
                        <div className="bg-white">
                            <div className="container">{/* PersonTable goes here */}</div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
};

export default Admin;
