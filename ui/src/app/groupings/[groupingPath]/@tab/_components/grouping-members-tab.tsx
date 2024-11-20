import GroupingMembersTable, {
    GroupingMembersTableSearchParams
} from './grouping-members-table/grouping-members-table';
import SortBy from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/sort-by';
import { getGroupingMembers } from '@/lib/actions';
import { Group } from '@/lib/types';
import { parseAsBoolean, parseAsInteger, parseAsStringEnum } from 'nuqs/server';

const size = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const GroupingMembersTab = async ({
    params,
    searchParams,
    group
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
    group?: Group;
}) => {
    const groupingPath = decodeURIComponent(params.groupingPath);

    const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);
    const sortBy = parseAsStringEnum<SortBy>(Object.values(SortBy))
        .withDefault(SortBy.NAME)
        .parseServerSide(searchParams.sortBy);
    const isAscending = parseAsBoolean.withDefault(true).parseServerSide(searchParams.isAscending);
    const searchString = searchParams.search;

    const groupPath = group ? groupingPath + ':' + group : groupingPath;
    const groupingGroupMembers = await getGroupingMembers(groupPath, {
        page,
        size,
        sortBy,
        isAscending,
        searchString
    });

    return (
        <GroupingMembersTable groupingGroupMembers={groupingGroupMembers} groupingPath={groupingPath} group={group} />
    );
};

export default GroupingMembersTab;
