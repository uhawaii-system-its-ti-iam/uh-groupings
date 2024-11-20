import { GroupingMembersTableSearchParams } from '@/lib/types';
import GroupingMembersTab from '../_components/grouping-members-tab';

const ExcludeTab = ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    return <GroupingMembersTab params={params} searchParams={searchParams} group="exclude" />;
};

export default ExcludeTab;
