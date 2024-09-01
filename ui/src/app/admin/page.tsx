import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PersonTable from '@/app/admin/personTable/page';

const Admin = () => {
    return (
        <Tabs className="bg-seafoam" defaultValue="manage-groupings">
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
                    <div className="container">{/* GroupingsTable goes here */}</div>
                </div>
            </TabsContent>
            <TabsContent value="manage-admins">
                <div className="bg-white">
                    <div className="container">{/* AdminTable goes here */}</div>
                </div>
            </TabsContent>
            <TabsContent value="manage-person">
                <div className="bg-white">
                    <div className="container">{<PersonTable />}</div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default Admin;
