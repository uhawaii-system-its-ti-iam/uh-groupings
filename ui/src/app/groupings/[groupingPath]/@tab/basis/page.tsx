import GroupingMembersTable from '@/components/table/grouping-members-table/grouping-members-table';
import { ownedGrouping } from '@/lib/actions';
import { searchGroupingMembers } from '@/lib/fetchers';
import { GroupingGroupMember, GroupingMembersTableSearchParams } from '@/lib/types';

const pageSize = process.env.NEXT_PUBLIC_PAGE_SIZE as string;

const ExcludeTab = async ({
    params,
    searchParams
}: {
    params: { groupingPath: string };
    searchParams: GroupingMembersTableSearchParams;
}) => {
    const groupingPath = decodeURIComponent(params.groupingPath);
    const { page, sortBy, isAscending, search } = searchParams;

    // TODO: Remove mapSortBy after GROUPINGS-1840 is complete
    const mapSortBy = (sortBy: string) => {
        switch (sortBy) {
            case 'uid':
                return 'search_string0';
            case 'uhUuid':
                return 'subjectId';
            default:
                return sortBy;
        }
    };

    const groupingMembers: GroupingGroupMember[] = search
        ? (await searchGroupingMembers(`${groupingPath}:basis`, search)).members
        : (await ownedGrouping([`${groupingPath}:basis`], page, pageSize, mapSortBy(sortBy), isAscending)).groupingBasis
              .members;

    return (
        <GroupingMembersTable groupingMembers={groupingMembers} groupingPath={groupingPath} groupingExtension="basis" />
    );
};

export default ExcludeTab;
