import GroupingMembersTab from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/grouping-members-table';

const OwnersTab = ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    return <GroupingMembersTab params={params} searchParams={searchParams} group="owners" />;
};

export default OwnersTab;
