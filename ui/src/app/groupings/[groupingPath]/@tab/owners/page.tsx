import GroupingMembersTab from '../_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '../_components/grouping-members-table/grouping-members-table';

const OwnersTab = async ({
    params,
    searchParams
}: {
    params: Promise<{ groupingPath: string }>;
    searchParams: Promise<GroupingMembersTableSearchParams>;
}) => {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);

    return <GroupingMembersTab params={resolvedParams} searchParams={resolvedSearchParams} group="owners" />;
};

export default OwnersTab;
