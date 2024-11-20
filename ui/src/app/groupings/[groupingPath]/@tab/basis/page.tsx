import { GroupingMembersTableSearchParams } from '@/lib/types';
import GroupingMembersTab from '../_components/grouping-members-tab';

const BasisTab = ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    return <GroupingMembersTab params={params} searchParams={searchParams} group="basis" />;
};

export default BasisTab;
