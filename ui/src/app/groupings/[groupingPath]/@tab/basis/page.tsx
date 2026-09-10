import GroupingMembersTab from '../_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '../_components/grouping-members-table/grouping-members-table';

const BasisTab = async ({
    params,
    searchParams
}: {
    params: Promise<{ groupingPath: string }>;
    searchParams: Promise<GroupingMembersTableSearchParams>;
}) => {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);

    return <GroupingMembersTab params={resolvedParams} searchParams={resolvedSearchParams} group="basis" />;
};

export default BasisTab;
