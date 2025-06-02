import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { removeExcludeMembers, removeIncludeMembers, removeOwners } from '@/lib/actions';
import { createPortal } from 'react-dom';
import { message } from '@/lib/messages';

const RemoveMembersModal = ({
    isOpen,
    onClose,
    membersToRemove,
    group,
    groupingPath,
    onSuccess,
    onProcessing
}: {
    isOpen: boolean;
    onClose: () => void;
    membersToRemove: Array<{ uid: string; uhUuid: string; name: string }>;
    group: string;
    onSuccess: () => void;
    onProcessing: () => void;
}) => {
    const handleRemoveMembers = async () => {
        onProcessing();
        try {
            if (Array.isArray(membersToRemove) && membersToRemove.length > 0) {
                const membersToRemoveFinal = membersToRemove.map((member) => member.uhUuid);

                switch (group) {
                    case 'include':
                        await removeIncludeMembers(membersToRemoveFinal, groupingPath);
                        break;
                    case 'exclude':
                        await removeExcludeMembers(membersToRemoveFinal, groupingPath);
                        break;
                    case 'owners':
                        await removeOwners(membersToRemoveFinal, groupingPath);
                        break;
                    default:
                        console.error('Error: Invalid group type provided.');
                        return;
                }

                onSuccess();
                onClose();
            } else {
                console.error('Error: membersToRemove is undefined or empty.');
            }
        } catch (error) {
            console.error('Error removing members:', error);
        }
    };

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent
                    className="max-w-[484px] sm:max-w-[500px] max-h-[90vh] rounded flex flex-col"
                    onInteractOutside={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => {
                        e.preventDefault();
                        document.body.focus();
                    }}
                >
                    <AlertDialogHeader className="text-left">
                        <AlertDialogTitle className="text-[1.4rem]">Remove Members</AlertDialogTitle>
                        <AlertDialogCancel
                            onClick={onClose}
                            className={`
                              absolute px-4 top-0 right-0 text-[1.5rem] font-bold text-input-text-grey 
                              hover:text-red-500 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 border-none
                            `}
                            variant="ghost"
                            aria-label="Close"
                        >
                            &times;
                        </AlertDialogCancel>
                    </AlertDialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <AlertDialogDescription>
                            Are you sure you want to remove the following members from the{' '}
                            <span className="capitalize">{group}</span> list?
                        </AlertDialogDescription>
                        <div className="flex justify-center max-h-[200px] overflow-y-auto px-4 py-4">
                            {Array.isArray(membersToRemove) && membersToRemove.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="text-sm">
                                            <th className="px-3 py-1 text-left">USERNAME</th>
                                            <th className="px-3 py-1 text-left">UH NUMBER</th>
                                            <th className="px-3 py-1 text-left">NAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {membersToRemove.map((member, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-1 text-left">
                                                    {member.uid === 'N/A' ? (
                                                        <span>
                                                            N/A{' '}
                                                            <TooltipProvider delayDuration={0}>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <FontAwesomeIcon
                                                                            icon={faCircleQuestion}
                                                                            className="text-text-color"
                                                                        />
                                                                    </TooltipTrigger>
                                                                    {createPortal(
                                                                        <TooltipContent
                                                                            className={`
                                                                              max-w-48 overflow-visible text-center 
                                                                              whitespace-normal p-2 border-none shadow-none
                                                                            `}
                                                                        >
                                                                            {
                                                                                message.RemoveMemberModals.TOOLTIP
                                                                                    .NO_UID_MULTIPLE
                                                                            }
                                                                        </TooltipContent>,
                                                                        document.body
                                                                    )}
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </span>
                                                    ) : (
                                                        String(member.uid)
                                                    )}
                                                </td>
                                                <td className="px-3 py-1 text-left">{member.uhUuid}</td>
                                                <td className="px-3 py-1 text-left">{member.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <span>No members to remove.</span>
                            )}
                        </div>
                        <div className="px-3 py-2">
                            <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                                <AlertDescription>{message.RemoveMemberModals.ALERT_DESCRIPTION}</AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <AlertDialogFooter className="flex flex-row justify-end space-x-2 px-4 pt-4 border-t">
                        <AlertDialogAction onClick={handleRemoveMembers} className="!h-[47px] !w-[50px]">
                            Yes
                        </AlertDialogAction>
                        <AlertDialogCancel onClick={onClose} className="mt-0 !h-[47px] !w-[72px] custom-reset-before">
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default RemoveMembersModal;
