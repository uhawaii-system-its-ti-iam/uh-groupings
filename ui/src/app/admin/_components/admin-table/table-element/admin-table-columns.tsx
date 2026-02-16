import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import RemoveMemberModal from '@/components/modal/remove-member-modal';
import { removeAdmin } from '@/lib/actions';
import RemoveMemberTrashcan from '@/components/ui/remove-member-trashcan';

const AdminTableColumns: ColumnDef<GroupingGroupMember>[] = [
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
        cell: ({ row }) => (
            <RemoveMemberTrashcan
                uid={row.getValue('uid')}
                name={row.getValue('name')}
                uhUuid={row.getValue('uhUuid')}
                group={'admins'}
                action={removeAdmin}
            />
        )
    }
];

export default AdminTableColumns;
