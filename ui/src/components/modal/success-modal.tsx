'use client';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const SuccessModal = ({
    isOpen,
    onClose,
    name,
    group,
    memberCount,
    manageType
}: {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    group: string;
    memberCount: number;
    manageType: string;
}) => {
    const getTitle = () => {
        if (manageType === 'removeMembers') {
            return memberCount > 1 ? 'Remove Members' : 'Remove Member';
        } else if (manageType === 'addMembers') {
            return memberCount > 1 ? 'Add Members' : 'Add Member';
        } else {
            return 'Success';
        }
    };

    const groupCapitalized = group.charAt(0).toUpperCase() + group.slice(1);

    const getDescription = () => {
        if (manageType === 'removeMembers') {
            return memberCount > 1
                ? `All members have been successfully removed from the ${groupCapitalized} list`
                : `${name} has been successfully removed from the ${groupCapitalized} list.`;
        } else if (manageType === 'addMembers') {
            return memberCount > 1
                ? `All members have been successfully added to the ${groupCapitalized} list`
                : `${name} has been successfully added to the ${groupCapitalized}</> list.`;
        } else {
            return 'Operation completed successfully.';
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[484px] sm:max-w-[500px] rounded">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[1.4rem] text-left">{getTitle()}</AlertDialogTitle>
                    <AlertDialogCancel
                        onClick={onClose}
                        className="
                  absolute px-4 top-0 right-0 text-[1.5rem] font-bold
                  text-input-text-grey hover:text-red-500 bg-transparent
                  hover:bg-transparent focus:outline-none focus:ring-0 border-none"
                        variant="ghost"
                        aria-label="Close"
                    >
                        &times;
                    </AlertDialogCancel>
                </AlertDialogHeader>
                <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
                <AlertDialogFooter className="flex flex-row justify-end space-x-2 px-4 pt-4 border-t">
                    <Button onClick={onClose}>OK</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SuccessModal;
