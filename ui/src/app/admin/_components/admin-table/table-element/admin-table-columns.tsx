import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import { message } from '@/lib/messages';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
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
        cell: ({ row }) => {
            const uid = row.getValue('uid') as string | undefined | null;

            if (!uid || uid.trim() === '') {
                return (
                    <span className="text-text-color pl-2 leading-relaxed">
                     N/A{' '}
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <FontAwesomeIcon icon={faQuestionCircle} color="black" size="lg" className="ml-1" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-48 text-center whitespace-normal" side="right">
                                {message.Tooltip.UID_NOT_APPLICABLE}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
                );
            }

            return <div className="pl-2 leading-relaxed">{uid}</div>;
        }
    },
    {
        header: 'Remove',
        cell: ({ row }) => (
            <div className="flex justify-center w-1/3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                data-testid={`remove-user-${row.original.uid}`}
                                aria-label={`Remove admin ${row.original.name}`}
                                onClick={() => onOpenRemove(row.original)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2Icon className="h-5 w-5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-48 text-center whitespace-normal" side="top">
                            {message.Tooltip.REMOVE_ADMIN}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )
    }
];

export default AdminTableColumns;
