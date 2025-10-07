import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import { Trash2Icon } from 'lucide-react';

const AdminTableColumns = (onOpenRemove: (member: GroupingGroupMember) => void): ColumnDef<GroupingGroupMember>[] => [
    {
        header: 'Admin Name',
        accessorKey: 'name',
        sortDescFirst: true,
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">
                {row.original.name}
            </div>
        ),
    },
    {
        header: 'UH Number',
        accessorKey: 'uhUuid',
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">
                {row.original.uhUuid}
            </div>
        ),
    },
    {
        header: 'UH Username',
        accessorKey: 'uid',
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">
                {row.original.uid}
            </div>
        ),
    },
    {
        header: 'Remove',
        cell: ({ row }) => (
            <button
                data-testid={`remove-user-${row.original.uid}`}
                aria-label={`Remove admin ${row.original.name}`}
                onClick={() => onOpenRemove(row.original)}
                className="text-red-600 hover:text-red-800"
            >
                <Trash2Icon className="h-4 w-4" />
            </button>
        ),
    },
];

export default AdminTableColumns;
