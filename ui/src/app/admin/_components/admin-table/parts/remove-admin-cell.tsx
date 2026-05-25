import { Row } from '@tanstack/react-table';
import { GroupingGroupMember } from '@/lib/types';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2Icon } from 'lucide-react';
import { message } from '@/lib/messages';
import RemoveMemberModal from '@/components/modal/remove-member-modal';

const RemoveAdminCell = ({
    row,
    onSuccess
}: {
    row: Row<GroupingGroupMember>;
    onSuccess: (type: string, count: number, name: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <button
                                onClick={() => setIsOpen(true)}
                                aria-label="Remove Admin"
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2Icon className="h-4 w-4" />
                            </button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-48 text-center whitespace-normal p-1 !border-none !shadow-none">
                        {message.Tooltip.TRASH_ICON_REMOVAL('admins')}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <RemoveMemberModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                memberToRemove={{
                    uid: row.getValue('uid'),
                    name: row.getValue('name'),
                    uhUuid: row.getValue('uhUuid')
                }}
                group="admins"
                groupingPath=""
                onSuccess={() => {
                    const memberName = row.getValue('name') as string;
                    onSuccess('removeMembers', 1, memberName);
                }}
                onProcessing={() => {
                    console.log('processing');
                }}
            />
        </>
    );
};

export default RemoveAdminCell;
