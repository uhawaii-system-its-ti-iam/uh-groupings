import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import { Trash2Icon } from 'lucide-react';

const createAdminColumns = (
    onOpenModal: (member: GroupingGroupMember) => void
): ColumnDef<GroupingGroupMember>[] => [
    {
        header: 'Admin Name',
        accessorKey: 'name',
        sortDescFirst: true,
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">{row.getValue('name')}</div>
        ),
    },
    {
        header: 'UH Number',
        accessorKey: 'uhUuid',
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">{row.getValue('uhUuid')}</div>
        ),
    },
    {
        header: 'UH Username',
        accessorKey: 'uid',
        cell: ({ row }) => (
            <div className="pl-2 leading-relaxed">{row.getValue('uid')}</div>
        ),
    },
    {
        header: 'Remove',
        cell: ({ row }) => {
            const member = {
                name: row.getValue('name'),
                uhUuid: row.getValue('uhUuid'),
                uid: row.getValue('uid'),
            } as GroupingGroupMember;

            return (
                <Trash2Icon
                    data-testid="remove-member-icon"
                    className="h-4 w-4 text-red-600 cursor-pointer"
                    onClick={() => onOpenModal(member)}
                />
            );
        },
    },
];

export default createAdminColumns;
