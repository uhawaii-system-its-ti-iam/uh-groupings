import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import RemoveMemberTrashcan from '@/components/ui/trashcan-icon';

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
            <RemoveMemberTrashcan
                dataTestId={`remove-user-${row.original.uid}`}
                ariaLabel={`Remove admin ${row.original.name}`}
                onClick={() => onOpenRemove(row.original)}
            />
        ),
    },
];

export default AdminTableColumns;
