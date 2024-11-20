import { Group, GroupingGroupMember, GroupingMember } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import GroupingMemberUidCell from './grouping-member-uid-cell';
import GroupingMemberWhereListedCell from './grouping-member-where-listed-cell';
import GroupingMemberIsBasisCell from './grouping-member-is-basis-cell';
import GroupingMemberNameCell from './grouping-member-name-cell';

const GroupingMembersTableColumns = (
    group?: Group,
    isPending?: boolean
): ColumnDef<GroupingGroupMember | GroupingMember>[] => {
    const columns: ColumnDef<GroupingGroupMember | GroupingMember>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => (
                <GroupingMemberNameCell
                    name={row.getValue('name')}
                    uid={row.getValue('uid')}
                    uhUuid={row.getValue('uhUuid')}
                />
            )
        },
        {
            header: 'UH Number',
            accessorKey: 'uhUuid'
        },
        {
            header: 'UH Username',
            accessorKey: 'uid',
            cell: ({ row }) => <GroupingMemberUidCell uid={row.getValue('uid')} />
        }
    ];

    if (!group) {
        columns.push({
            header: 'Listing',
            accessorKey: 'whereListed',
            enableSorting: false,
            cell: ({ row }) => (
                <GroupingMemberWhereListedCell whereListed={row.getValue('whereListed')} isPending={isPending} />
            )
        });
    } else if (!['basis', 'owners'].includes(group)) {
        columns.push({
            header: 'Basis?',
            accessorKey: 'whereListed',
            enableSorting: false,
            cell: ({ row }) => (
                <GroupingMemberIsBasisCell whereListed={row.getValue('whereListed')} isPending={isPending} />
            )
        });
    }

    return columns;
};

export default GroupingMembersTableColumns;
