'use client';

import { useReducer, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileExport,
    faCaretDown,
    faUsers,
    faUserPlus,
    faUserMinus,
    faIdCard
} from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const memberSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    uid: z.string(),
    uhUuid: z.string()
});

const groupingMemberSchema = z.object({
    allMembers: z.object({
        members: z.array(memberSchema)
    }),
    groupingInclude: z.object({
        members: z.array(memberSchema)
    }),
    groupingExclude: z.object({
        members: z.array(memberSchema)
    }),
    groupingBasis: z.object({
        members: z.array(memberSchema)
    })
});

type Member = z.infer<typeof memberSchema>;
type GroupingMembers = z.infer<typeof groupingMemberSchema>;

interface ExportDropdownProps {
    groupingMembers: GroupingMembers;
    groupPath: string;
}

const initialState = {
    isOpen: false
};

type State = typeof initialState;
type Action = { type: 'TOGGLE' } | { type: 'CLOSE' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'TOGGLE':
            return { ...state, isOpen: !state.isOpen };
        case 'CLOSE':
            return { ...state, isOpen: false };
    }
};

const ExportDropdown = ({ groupingMembers, groupPath }: ExportDropdownProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const groupings = [
        { label: 'All Members', members: groupingMembers?.allMembers?.members, icon: faUsers },
        { label: 'Basis', members: groupingMembers?.groupingBasis?.members, icon: faIdCard },
        { label: 'Include', members: groupingMembers?.groupingInclude?.members, icon: faUserPlus },
        { label: 'Exclude', members: groupingMembers?.groupingExclude?.members, icon: faUserMinus }
    ];

    const validGroupings = groupings.filter((group) => group.members.length > 0);

    const isDisabled = validGroupings.length === 0;

    const handleExportGrouping = (grouping: string) => {
        const groupingPath = groupPath.split(':');
        const groupName = groupingPath[groupingPath.length - 1];

        type Grouping = 'All Members' | 'Basis' | 'Include' | 'Exclude';

        const groupMapping: Record<Grouping, { exportData: Member[] | null; fileName: string }> = {
            'All Members': {
                exportData: groupingMembers?.allMembers.members,
                fileName: `${groupName}_members_list.csv`
            },
            Basis: {
                exportData: groupingMembers?.groupingBasis.members,
                fileName: `${groupName}_basis_list.csv`
            },
            Include: {
                exportData: groupingMembers?.groupingInclude.members,
                fileName: `${groupName}_include_list.csv`
            },
            Exclude: {
                exportData: groupingMembers?.groupingExclude.members,
                fileName: `${groupName}_exclude_list.csv`
            }
        };

        const { exportData, fileName } = groupMapping[grouping as Grouping];

        if (exportData) {
            const csv = generateCSV(exportData);
            downloadCSV(csv, fileName);
        }

        closeDropdown();
    };

    const generateCSV = (members: Member[]) => {
        const header = ['Last', 'First', 'Username', 'UH Number', 'Email'];
        const rows = members.map((member) => {
            const email = member.uid ? `${member.uid}@hawaii.edu` : '';
            return [member.lastName, member.firstName, member.uid, member.uhUuid, email];
        });

        const csvRows = [header, ...rows].map((row) => row.join(',')).join('\n');
        return csvRows;
    };

    const downloadCSV = (csvContent: string, fileName: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    const toggleDropdown = () => {
        if (!state.isOpen) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }
        dispatch({ type: 'TOGGLE' });
    };

    const closeDropdown = () => {
        dispatch({ type: 'CLOSE' });
        document.removeEventListener('click', handleOutsideClick);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            closeDropdown();
        }
    };

    return (
        <div className="btn-group float-right relative" ref={dropdownRef}>
            <TooltipProvider>
                {isDisabled ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                aria-label="Export Grouping"
                                onClick={toggleDropdown}
                                disabled={isDisabled}
                                className="flex items-center border border-solid border-gray-300 text-text-primary rounded-md
                                        px-3 py-1.5 text-base focus-visible:ring-[3px] focus-visible:ring-blue-200
                                        bg-gray-200 cursor-not-allowed"
                            >
                                <FontAwesomeIcon className="mr-2 text-text-primary" icon={faFileExport} />
                                Export Grouping
                                <FontAwesomeIcon className="ml-2 text-text-primary" icon={faCaretDown} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>No members to export.</TooltipContent>
                    </Tooltip>
                ) : (
                    <button
                        aria-label="Export Grouping"
                        onClick={toggleDropdown}
                        disabled={isDisabled}
                        className="flex items-center border border-solid border-gray-300 bg-white
                        text-text-primary rounded-md px-3 py-1.5 text-base rounded-t rounded-b
                        focus-visible:ring-[3px] focus-visible:ring-blue-200 focus:ring-[2.5px]
                        focus:ring-blue-200"
                    >
                        <FontAwesomeIcon className="mr-2 text-text-primary" icon={faFileExport} />
                        Export Grouping
                        <FontAwesomeIcon className="ml-2 text-text-primary" icon={faCaretDown} />
                    </button>
                )}
            </TooltipProvider>

            {state.isOpen && (
                <div
                    className="flex absolute bg-white rounded-b rounded-t border-solid border-x border-y
                    leading-6 mx-0 mb-0 mt-0.5 py-2 px-0 min-w-40 font-normal text-left left-[-28.8px]"
                >
                    <ul className="list-none m-0 p-0">
                        {validGroupings.map(({ label, icon }) => (
                            <li key={label}>
                                <button
                                    className="mb-2 py-1 px-6 w-52 text-left font-normal hover:bg-gray-100 rounded"
                                    onClick={() => handleExportGrouping(label)}
                                >
                                    <FontAwesomeIcon className="mr-2" icon={icon} />
                                    Export {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ExportDropdown;
