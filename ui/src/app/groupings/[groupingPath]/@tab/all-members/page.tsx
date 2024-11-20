import { GroupingMembersTableSearchParams } from '@/lib/types';
import GroupingMembersTab from '../_components/grouping-members-tab';

const AllMembersTab = ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    return <GroupingMembersTab params={params} searchParams={searchParams} />;
};

export default AllMembersTab;
