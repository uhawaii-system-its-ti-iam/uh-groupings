import { ColumnDef } from '@tanstack/react-table';
import { GroupingPath } from '@/lib/types';
import GroupingPathCell from '@/components/table/groupings-table/table-element/grouping-path-cell';
import GroupingDescriptionCell from '@/components/table/groupings-table/table-element/grouping-description-cell';
import MembershipsOptCell from '@/app/memberships/_components/memberships-table-opt-cell';

const MembershipsTableColumns = (isOptOut: boolean, removeRow: (path: string) => void): ColumnDef<GroupingPath>[] => [
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
        header: isOptOut ? 'Opt Out?' : 'Opt In?',
        accessorKey: isOptOut ? 'optOutEnabled' : 'optInEnabled',
        enableHiding: false,
        cell: ({ row }) => (
            <MembershipsOptCell
                isOptOut={isOptOut}
                optOutEnabled={row.getValue(isOptOut ? 'optOutEnabled' : 'optInEnabled')}
                groupingPath={row.getValue('path')}
                removeRow={removeRow}
            />
        )
    }
];
export default MembershipsTableColumns;
