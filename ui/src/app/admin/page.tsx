import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PersonTable from '@/app/admin/personTable/page';
import AdminTable from '@/app/admin/adminTable/page';
import GroupingsTable from '@/app/admin/groupingsTable/page';
import Link from 'next/link';

const Admin = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const tab = searchParams.tab || 'groupings';
    // const observer = new PerformanceObserver((list) => {
    //     list.getEntries().forEach((entry) => {
    //         if (entry.type === 'reload') {
    //             console.log(`${entry.name} was reloaded!`);
    //             console.log(entry);
    //         }
    //     });
    // });
    //
    // observer.observe({ type: 'navigation', buffered: true });
    // const entries = performance.getEntriesByType('navigation');
    // entries.forEach((entry) => {
    //     if (entry.type === 'reload') {
    //         console.log(`${entry.name} was reloaded!`);
    //         console.log(entry);
    //     }
    // });
    return (
        <Tabs className="bg-seafoam" defaultValue={`manage-${tab}`}>
            <div className="container">
                <TabsList variant="outline">
                    <Link key={'groupings'} href={`?tab=groupings`} replace>
                        <TabsTrigger value="manage-groupings" variant="outline">
                            Manage Groupings
                        </TabsTrigger>
                    </Link>
                    <Link key={'admins'} href={'?tab=admins'} replace>
                        <TabsTrigger value="manage-admins" variant="outline">
                            Manage Admins
                        </TabsTrigger>
                    </Link>
                    <Link key={'person'} href={'?tab=person'} replace>
                        <TabsTrigger value="manage-person" variant="outline">
                            Manage Person
                        </TabsTrigger>
                    </Link>
                </TabsList>
            </div>
            <TabsContent value="manage-groupings">
                <div className="bg-white">
                    <div className="container">{<GroupingsTable />}</div>
                </div>
            </TabsContent>
            <TabsContent value="manage-admins">
                <div className="bg-white">
                    <div className="container">{<AdminTable />}</div>
                </div>
            </TabsContent>
            <TabsContent value="manage-person">
                <div className="bg-white">
                    <div className="container">{<PersonTable searchParams={searchParams} />}</div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default Admin;
