import { Group, GroupingGroupMember, GroupingGroupMembers, GroupingMember } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import GroupingMemberUidCell from './grouping-member-uid-cell';
import GroupingMemberWhereListedCell from './grouping-member-where-listed-cell';
import GroupingMemberIsBasisCell from './grouping-member-is-basis-cell';
import GroupingMemberNameCell from './grouping-member-name-cell';
import { Trash2Icon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { message } from '@/lib/messages';

const GroupingMembersTableColumns = (
    onOpenManageMemberModal: (manageType: string, membersInList: GroupingGroupMembers['members']) => void,
    group?: Group,
    isPending?: boolean
): ColumnDef<GroupingGroupMember | GroupingMember>[] => {
    const columns: ColumnDef<GroupingGroupMember | GroupingMember>[] = [
        ...(['include', 'exclude'].includes(group || '')
            ? [
                  {
                      id: 'select',
                      header: ({ table }) => (
                          <div className="flex flex-col-reverse md:flex-row items-center justify-center">
                              <input
                                  type="checkbox"
                                  className="w-3 h-3"
                                  checked={table.getIsAllPageRowsSelected() && !table.getIsSomePageRowsSelected()}
                                  onChange={(event) => {
                                      table.toggleAllPageRowsSelected(event.target.checked);
                                  }}
                                  aria-label="Select all rows"
                              />
                              <div className="w-3 h-3 flex items-center py-2 md:py-0 justify-center md:mb-0 md:ml-1.5">
                                  {table.getIsAllPageRowsSelected() && (
                                      <TooltipProvider delayDuration={0}>
                                          <Tooltip>
                                              <TooltipTrigger>
                                                  <FontAwesomeIcon icon={faTools} className="w-3 h-3" />
                                              </TooltipTrigger>
                                              <TooltipContent
                                                  className="max-w-48 text-center whitespace-normal normal-case font-normal border-none shadow-none"
                                                  side="right"
                                              >
                                                  {message.Tooltip.SELECT_ALL_LIST}
                                              </TooltipContent>
                                          </Tooltip>
                                      </TooltipProvider>
                                  )}
                              </div>
                          </div>
                      ),
                      cell: ({ row }) => (
                          <span className="flex items-center justify-center">
                              <input
                                  type="checkbox"
                                  checked={row.getIsSelected()}
                                  onChange={(event) => row.toggleSelected(event.target.checked)}
                                  className="w-3 h-3"
                                  aria-label="Select row"
                              />
                          </span>
                      )
                  }
              ]
            : []),
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => (
                <div className="flex justify-between w-full">
                    <div className="whitespace-normal break-words overflow-hidden">
                        <GroupingMemberNameCell
                            name={row.getValue('name')}
                            uid={row.getValue('uid')}
                            // uhUuid={row.getValue('uhUuid')}
                            uhUuid={group !== 'owners' ? row.getValue('uhUuid') : ''}
                        />
                    </div>
                    {['include', 'exclude', 'owners'].includes(group || '') && (
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <button
                                            onClick={() =>
                                                onOpenManageMemberModal('removeMembers', [
                                                    { ...row.original } as GroupingGroupMembers['members'][number]
                                                ])
                                            }
                                            aria-label="Remove Member"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-48 text-center whitespace-normal p-1 !border-none !shadow-none">
                                    {message.Tooltip.TRASH_ICON_REMOVAL(group || '')}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )
        },
        ...(group !== 'owners'
            ? [
                  {
                      header: 'UH Number',
                      accessorKey: 'uhUuid'
                  }
              ]
            : []),
        {
            header: 'UH Username',
            accessorKey: 'uid',
            cell: ({ row }) => <GroupingMemberUidCell uid={row.getValue('uid')} />
        }
    ];
    if (!group) {
        columns.push({
            header: 'Listing',
            accessorKey: 'whereListed',
            enableSorting: false,
            cell: ({ row }) => (
                <GroupingMemberWhereListedCell whereListed={row.getValue('whereListed')} isPending={isPending} />
            )
        });
    } else if (!['basis', 'owners'].includes(group)) {
        columns.push({
            header: 'Basis?',
            accessorKey: 'whereListed',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="!whitepsace-normal !break-words !overflow-visible">
                    <GroupingMemberIsBasisCell whereListed={row.getValue('whereListed')} isPending={isPending} />
                </div>
            )
        });
    }
    return columns;
};

export default GroupingMembersTableColumns;
