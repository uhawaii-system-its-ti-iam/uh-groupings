import ExportDropdown from './_components/export-dropdown';
import GroupingHeader from './_components/grouping-header';
import ReturnButtons from './_components/return-buttons';
import SideNav from './_components/side-nav';
import { groupingDescription, allGroupingMembers } from '@/lib/fetchers';

const GroupingPathLayout = async ({ params, tab }: { params: { groupingPath: string }; tab: React.ReactNode }) => {
    const groupPath = decodeURIComponent(params.groupingPath);
    const { description } = await groupingDescription(groupPath);
    const groupName = groupPath.split(':').pop() as string;
    const fromManageSubject = groupPath.includes('manage-person');

    const groupPaths = [`${groupPath}:include`, `${groupPath}:exclude`, `${groupPath}:basis`, `${groupPath}:owners`];
    const sortString = 'name';
    const isAscending = true;
    const fetchGroupingMembers = await allGroupingMembers(groupPaths, sortString, isAscending);
    const defaultGroupingMembers = {
        allMembers: { members: [] },
        groupingInclude: { members: [] },
        groupingExclude: { members: [] },
        groupingBasis: { members: [] }
    };
    const groupingMembers = { ...defaultGroupingMembers, ...fetchGroupingMembers };

    return (
        <div className="container">
            <div className="mt-4">
                <ReturnButtons fromManageSubject={fromManageSubject} />
                <ExportDropdown groupingMembers={groupingMembers} groupPath={groupPath} />
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
    );
};

export default GroupingPathLayout;
