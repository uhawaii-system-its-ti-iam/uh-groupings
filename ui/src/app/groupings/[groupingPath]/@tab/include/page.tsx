import GroupingMembersTab from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table';

const IncludeTab = ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    return <GroupingMembersTab params={params} searchParams={searchParams} group="include" />;
};

export default IncludeTab;
