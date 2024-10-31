import {ColumnDef} from '@tanstack/react-table';
import {GroupingPath} from '@/lib/types';
import GroupingPathCell from '@/components/table/table-element/grouping-path-cell';
import GroupingDescriptionCell from '@/components/table/table-element/ grouping-description-cell';
import MembershipsOptOutCell from '@/app/memberships/_components/memberships-optout-cell';
import MembershipsOptInCell from '@/app/memberships/_components/memberships-optIn-cell';

const MembershipsTableColumns = (isOptOut: boolean): ColumnDef<GroupingPath>[] => [
    {
        header: 'Grouping Name',
        accessorKey: 'name',
        enableHiding: false,
        sortDescFirst: true,
        cell: ({row}) => <div className="pl-2 leading-relaxed">{row.getValue('name')}</div>
    },
    {
        header: 'Description',
        accessorKey: 'description',
        cell: ({row}) => <GroupingDescriptionCell description={row.getValue('description')}></GroupingDescriptionCell>
    },
    {
        header: 'Grouping Path',
        accessorKey: 'path',
        cell: ({row}) => <GroupingPathCell path={row.getValue('path')}/>
    },
    {
        header: isOptOut ? 'Opt Out?' : 'Opt In?',
        accessorKey: isOptOut ? 'optOutEnabled' : 'optInEnabled',
        enableHiding: false,
        cell: ({row}) => isOptOut ?
            <MembershipsOptOutCell optOutEnabled={row.getValue('optOutEnabled')} groupingPath={row.getValue('path')}/>
            : <MembershipsOptInCell groupingPath={row.getValue('path')}/>
    }
];
export default MembershipsTableColumns;
