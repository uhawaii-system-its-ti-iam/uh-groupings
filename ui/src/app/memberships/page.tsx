import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Memberships = () => {
    return ( 
        <main>
            <div className="bg-seafoam pt-3">
                <div className="container">
                    <h1 className="mb-1 font-bold text-[2rem] text-center md:text-left">Manage My Memberships</h1>
                    <p className="pb-8 text-xl text-center md:text-left">
                        View and manage my memberships. Search for new groupings to join as a member.
                    </p>
                </div>
                <Tabs defaultValue="current-memberships">
                    <div className="container">
                        <TabsList variant="outline">
                            <TabsTrigger 
                                value="current-memberships" variant="outline">
                                    Current Memberships
                            </TabsTrigger>
                            <TabsTrigger 
                                value="membership-opportunities" variant="outline">
                                    Membership Opportunities
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="current-memberships">
                        <div className="bg-white">
                            <div className="container">
                                {/* MembershipsTable goes here */}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="membership-opportunities">
                        <div className="bg-white">
                            <div className="container">
                                {/* MembershipsTable goes here */}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
 
export default Memberships;
