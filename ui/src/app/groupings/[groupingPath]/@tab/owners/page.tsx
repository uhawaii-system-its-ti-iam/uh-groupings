import GroupingMembersTab from '../_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '../_components/grouping-members-table/grouping-members-table';

export { generateGroupingMetadata as generateMetadata } from '../../grouping-metadata';

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
