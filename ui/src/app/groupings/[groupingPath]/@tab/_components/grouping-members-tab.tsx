import GroupingMembersTable from '@/components/table/grouping-members-table/grouping-members-table';
import SortBy, { mapSortBy } from '@/components/table/table-element/sort-by';
import { searchGroupingMembers, getGroupingMembers } from '@/lib/fetchers';
import { GroupingGroupMember, GroupingMember, GroupingMembersTableSearchParams } from '@/lib/types';
import { parseAsBoolean, parseAsInteger, parseAsStringEnum } from 'nuqs/server';

const size = Number(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const GroupingMembersTab = async ({
    params,
    searchParams,
    group
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
    group?: string;
}) => {
    const groupingPath = decodeURIComponent(params.groupingPath);

    const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);
    const sortBy = parseAsStringEnum<SortBy>(Object.values(SortBy))
        .withDefault(SortBy.NAME)
        .parseServerSide(searchParams.sortBy);
    const isAscending = parseAsBoolean.withDefault(true).parseServerSide(searchParams.isAscending);
    const search = searchParams.search;

    const groupPath = group ? groupingPath + ':' + group : groupingPath;
    const groupingMembers: GroupingGroupMember[] | GroupingMember[] = search
        ? (await searchGroupingMembers(groupPath, search)).members
        : (await getGroupingMembers(groupPath, { page, size, sortString: mapSortBy(sortBy), isAscending })).members;

    return <GroupingMembersTable groupingMembers={groupingMembers} groupingPath={groupingPath} group={group} />;
};

export default GroupingMembersTab;
