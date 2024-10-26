import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { membershipResults } from '@/lib/fetchers';
import MembershipsTable from '@/app/memberships/_components/memberships-table';

const Memberships = async () => {
    const { results } = await membershipResults();
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
                        <MembershipsTable results={results} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="membership-opportunities">
                <div className="bg-white">
                    <div className="container">{/* MembershipsTable goes here */}</div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default Memberships;
