import GroupingMembersTab from '../_components/grouping-members-tab';
import { GroupingMembersTableSearchParams } from '../_components/grouping-members-table/grouping-members-table';

export { generateGroupingMetadata as generateMetadata } from '../../grouping-metadata';

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
