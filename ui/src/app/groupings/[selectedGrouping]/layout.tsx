import ExportDropdown from './_components/export-dropdown';
import GroupingHeader from './_components/grouping-header';
import ReturnButtons from './_components/return-buttons';
import SideNav from './_components/side-nav';

import {groupingDescription} from '@/actions/groupings-api';

const SelectedGroupingLayout = async ({ params, tab }: { params: { selectedGrouping: string }; tab: React.ReactNode }) => {

    const res = await groupingDescription(params.selectedGrouping);
    const groupPath = res.groupPath;
    const description = res.description;
    const groupName = 'groupName';
    //const groupName = groupPath.split(':').pop();

    return (
        <div className="container">
            <div className="mt-4">
                <ReturnButtons />
                <ExportDropdown />
            </div>
            <div className="mb-5 mt-0">
                <GroupingHeader groupName={groupName} groupPath={groupPath} description={description} />
                <div className="p-0 min-h-px box-border border-b border-l border-r rounded-b">
                    <div className="flex flex-col md:flex-row mx-auto w-full">
                        <SideNav selectedGrouping={params.selectedGrouping}/>
                        {tab}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedGroupingLayout;
