import { ColumnDef } from '@tanstack/react-table';
import { GroupingPath } from '@/lib/types';
import GroupingPathCell from '@/components/table/groupings-table/table-element/grouping-path-cell';
import GroupingDescriptionCell from '@/components/table/groupings-table/table-element/grouping-description-cell';
import GroupingNameCell from '@/components/table/groupings-table/table-element/grouping-name-cell';

const GroupingsTableColumns: ColumnDef<GroupingPath>[] = [
    {
        header: 'Grouping Name',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true,
        cell: ({ row }) => (
            <GroupingNameCell path={row.getValue('path')} name={row.getValue('name')}></GroupingNameCell>
        )
    },
    {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => (
            <GroupingDescriptionCell description={row.getValue('description')}></GroupingDescriptionCell>
        )
    },
    {
        header: 'Grouping Path',
        accessorKey: 'path',
        cell: ({ row }) => <GroupingPathCell path={row.getValue('path')} />
    }
];
export default GroupingsTableColumns;
