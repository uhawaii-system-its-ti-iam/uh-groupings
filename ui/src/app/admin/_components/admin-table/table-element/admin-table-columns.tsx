import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import RemoveAdminCell from './remove-admin-cell';
const AdminTableColumns = (
    onManageAdminSuccess: (type: string, count: number, name: string) => void
): ColumnDef<GroupingGroupMember>[] => [
    {
        header: 'Admin Name',
        accessorKey: 'name',
        sortDescFirst: true,
        cell: ({ row }) => <div className="pl-2 leading-relaxed">{row.getValue('name')}</div>
    },
    {
        header: 'UH Number',
        accessorKey: 'uhUuid',
        cell: ({ row }) => <div className="pl-2 leading-relaxed">{row.getValue('uhUuid')}</div>
    },
    {
        header: 'UH Username',
        accessorKey: 'uid',
        cell: ({ row }) => <div className="pl-2 leading-relaxed">{row.getValue('uid')}</div>
    },
    {
        header: 'Remove',
        cell: ({ row }) => <RemoveAdminCell row={row} onSuccess={onManageAdminSuccess} />
    }
];

export default AdminTableColumns;
