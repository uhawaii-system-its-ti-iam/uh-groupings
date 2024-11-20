import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GroupingGroupMember, GroupingMember } from '@/lib/types';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';

const GroupingMembersTableColumns = (
    groupingExtension?: string,
    isBasisSet: Set<string> = new Set(),
    isBasisSetPending?: boolean
): ColumnDef<GroupingGroupMember | GroupingMember>[] => {
    const columns: ColumnDef<GroupingGroupMember | GroupingMember>[] = [
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'UH Number',
            accessorKey: 'uhUuid'
        },
        {
            header: 'UH Username',
            accessorKey: 'uid',
            cell: ({ row }) => (
                <>
                    {row.getValue('uid') ? (
                        row.getValue('uid')
                    ) : (
                        <span className="text-text-color">
                            N/A{' '}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <FontAwesomeIcon icon={faQuestionCircle} color="black" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-48 text-center whitespace-normal" side="right">
                                        UH Username not available. Either it has not yet been assigned, or the subject
                                        is no longer with UH.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </span>
                    )}
                </>
            )
        }
    ];

    if (!groupingExtension) {
        columns.push({
            header: 'Listing',
            accessorKey: 'whereListed',
            enableSorting: false
        });
    } else if (!['basis', 'owners'].includes(groupingExtension!)) {
        columns.push({
            header: () => <>Basis? {isBasisSetPending && <Spinner size="xs" className="ml-1" />}</>,
            accessorKey: 'inBasis',
            enableSorting: false,
            cell: ({ row }) => <i>{isBasisSet.has(row.getValue('uhUuid')) ? 'Yes' : 'No'}</i>
        });
    }

    return columns;
};

export default GroupingMembersTableColumns;
