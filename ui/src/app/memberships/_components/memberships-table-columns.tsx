import { ColumnDef } from '@tanstack/react-table';
import { GroupingPath } from '@/lib/types';
import GroupingPathCell from '@/components/table/table-element/grouping-path-cell';
import GroupingDescriptionCell from '@/components/table/table-element/ grouping-description-cell';
import MembershipsOptOutCell from '@/app/memberships/_components/memberships-optout-cell';

const MembershipsTableColumns: ColumnDef<GroupingPath>[] = [
    {
        header: 'Grouping Name',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true,
        cell: ({ row }) => <div className="pl-2 leading-relaxed">{row.getValue('name')}</div>
    },
    {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => <GroupingDescriptionCell description={row.getValue('description')}></GroupingDescriptionCell>
    },
    {
        header: 'Grouping Path',
        accessorKey: 'path',
        cell: ({ row }) => <GroupingPathCell path={row.getValue('path')} />
    },
    {
        header: 'Opt Out?',
        accessorKey: 'optOutEnabled',
        enableHiding: false,
        cell: ({ row }) => <MembershipsOptOutCell optOutEnabled={row.getValue('optOutEnabled')} />
    }
];
export default MembershipsTableColumns;
