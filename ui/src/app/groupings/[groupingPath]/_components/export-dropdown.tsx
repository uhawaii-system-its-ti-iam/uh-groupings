'use client';

import { useTransition } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileExport,
    faCaretDown,
    faUsers,
    faUserPlus,
    faUserMinus,
    faIdCard
} from '@fortawesome/free-solid-svg-icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { getGroupingMembers } from '@/lib/actions';
import { GroupingGroupMembers } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

const ExportDropdown = ({ groupingPath }: { groupingPath: string }) => {
    const groups = [
        { type: '', label: 'All Members', icon: faUsers },
        { type: 'basis', label: 'Basis', icon: faIdCard },
        { type: 'include', label: 'Include', icon: faUserPlus },
        { type: 'exclude', label: 'Exclude', icon: faUserMinus }
    ];

    const [isPending, startTransition] = useTransition();

    const exportCsv = async (group: string) => {
        startTransition(async () => {
            const groupPath = group === '' ? groupingPath : `${groupingPath}:${group}`;
            const sortString = 'name';
            const isAscending = true;
            const data: GroupingGroupMembers = await getGroupingMembers(groupPath, { sortString, isAscending });

            const members = data.members;
            const groupName = groupingPath.split(':').pop();
            const headers = ['Last', 'First', 'Username', 'UH Number', 'Email'];

            const rows = members.map((member) => {
                let email = '';
                if (member.uid && /^[a-zA-Z0-9._%+-]+$/.test(member.uid)) {
                    email = `${member.uid}@hawaii.edu`;
                }
                return [member.lastName, member.firstName, member.uid, member.uhUuid, email];
            });

            const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = group === '' ? `${groupName}_members_list.csv` : `${groupName}_${group}_list.csv`;
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <form className="btn-group float-right relative">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Export Grouping"
                                    variant="light"
                                    className="px-3 py-1.5 text-base"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Spinner size="sm" className="mr-1" />
                                    ) : (
                                        <FontAwesomeIcon className="mr-2 text-base" icon={faFileExport} />
                                    )}
                                    Export Grouping
                                    <FontAwesomeIcon className="ml-2 text-base" icon={faCaretDown} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {groups.map(({ type, label, icon }) => (
                                    <DropdownMenuItem
                                        className="text-base mb-2 py-1 px-6 text-left font-normal rounded
                                        cursor-pointer"
                                        key={type}
                                        onClick={() => exportCsv(type)}
                                        disabled={isPending}
                                    >
                                        <FontAwesomeIcon className="mr-2 text-base" icon={icon} /> Export {label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider>
        </form>
    );
};

export default ExportDropdown;
