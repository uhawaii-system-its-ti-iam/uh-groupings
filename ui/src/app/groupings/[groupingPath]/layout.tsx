import Providers from '@/components/layout/providers';
import ExportDropdown from './_components/export-dropdown';
import GroupingHeader from './_components/grouping-header';
import ReturnButtons from './_components/return-buttons';
import SideNav from './_components/side-nav';
import { groupingDescription } from '@/lib/fetchers';

const GroupingPathLayout = async ({ params, tab }: { params: { groupingPath: string }; tab: React.ReactNode }) => {
    const groupPath = decodeURIComponent(params.groupingPath);
    const { description } = await groupingDescription(groupPath);
    const groupName = groupPath.split(':').pop() as string;
    const fromManageSubject = groupPath.includes('manage-person');

    return (
        <Providers>
            <div className="container">
                <div className="mt-4">
                    <ReturnButtons fromManageSubject={fromManageSubject} />
                    <ExportDropdown groupingPath={groupPath} />
                </div>
                <div className="mb-5 mt-0">
                    <GroupingHeader groupName={groupName} groupPath={groupPath} groupDescription={description} />
                    <div className="p-0 min-h-px box-border border-b border-l border-r rounded-b">
                        <div className="flex flex-col md:flex-row mx-auto w-full">
                            <SideNav groupingPath={params.groupingPath} />
                            <div data-testid="tab-content">{tab}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Providers>
    );
};

export default GroupingPathLayout;
