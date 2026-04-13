import { ColumnDef } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { message } from '@/lib/messages';

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
                {row.original.uid ? (
                    row.original.uid
                ) : (
                    <span className="text-text-color">
                        N/A{' '}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-black cursor-pointer inline"
                                        aria-label="UH Username not available"
                                    >
                                        <FontAwesomeIcon icon={faQuestionCircle} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-48 text-center whitespace-normal" side="right">
                                    {message.RemoveMemberModals.TOOLTIP.NO_UID_MULTIPLE}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </span>
                )}
            </div>
        ),
    },
    {
        header: 'Remove',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            data-testid={`remove-user-${row.original.uhUuid}`}
                            aria-label={`Remove ${row.original.name} as admin. There must be at least one admin remaining.`}
                            onClick={() => onOpenRemove(row.original)}
                            className="text-red-600 hover:text-red-800 cursor-pointer pt-1"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} className="w-6 h-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        {message.Actions.Trashcan_Admin}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    },
];

export default AdminTableColumns;
