import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Admin = () => {
    return ( 
        <main>
            <div className="bg-seafoam pt-3">
                <div className="container">
                    <h1 className="mb-1 font-bold text-[2rem] text-center md:text-left">UH Groupings Administration</h1>
                    <p className="pb-8 text-xl text-center md:text-left">
                        Search for and manage any grouping on behalf of its owner. 
                        Manage the list of UH Groupings administrators.
                    </p>
                </div>
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
                                {/* GroupingsTable goes here */}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="manage-admins">
                        <div className="bg-white">
                            <div className="container">
                                {/* AdminTable goes here */}
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
