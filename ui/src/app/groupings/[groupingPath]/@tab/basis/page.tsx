import GroupingMembersTab from '../_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '../_components/grouping-members-table/grouping-members-table';

const BasisTab = async ({
    params,
    searchParams
}: {
    params: Promise<{ groupingPath: string }>;
    searchParams: Promise<GroupingMembersTableSearchParams>;
}) => {
    return <GroupingMembersTab params={await params} searchParams={await searchParams} group="basis" />;
};

export default BasisTab;
