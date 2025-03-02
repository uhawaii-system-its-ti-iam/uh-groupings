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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { MemberResult } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DynamicModal from '@/components/modal/dynamic-modal';
import { Group } from '@/lib/types';

const AddMemberModal = ({
    uid,
    name,
    uhUuid,
    group,
    action,
    onClose
}: {
    uid: MemberResult;
    name: MemberResult;
    uhUuid: MemberResult;
    group: Group;
    action: (id: string) => Promise<void>;
    onClose: () => void;
}) => {
    const [open, setOpen] = useState(true);
    const [dynamicModalOpen, setDynamicModalOpen] = useState(false);
    const router = useRouter();

    const handleClose = (confirmed: boolean) => {
        setOpen(false);
        if (confirmed) {
            setDynamicModalOpen(true);
        } else {
            onClose();
        }
    };

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="sm:max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[1.4rem] text-text-color">Add Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to add the following member to the <span>{group}</span> list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid grid-cols-2">
                        <div className="grid">
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">NAME:</Label>
                            </div>
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">UH USERNAME:</Label>
                            </div>
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">UH USER ID:</Label>
                            </div>
                        </div>

                        <div className="grid">
                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-s text-left whitespace-nowrap">{name}</Label>
                            </div>
                            <div className="grid grid-cols-4 items-center">
                                <Label className="text-s text-left whitespace-nowrap">{uid}</Label>
                            </div>
                            <div className="grid grid-cols-4 items-center">
                                <Label className="text-s text-left whitespace-nowrap">{uhUuid}</Label>
                            </div>
                        </div>
                    </div>

                    <AlertDialogDescription>
                        Are you sure you want to add <span className="font-bold text-text-color">{name}</span> to the{' '}
                        <span>{group}</span> list?
                    </AlertDialogDescription>

                    <div className="px-3">
                        <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                            <AlertDescription>
                                Membership changes made may not take effect immediately. Usually, 3-5 minutes should be
                                anticipated. In extreme cases, changes may take several hours to be fully processed,
                                depending on the number of members and the synchronization destination.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <AlertDialogFooter>
                        <Button
                            onClick={async () => {
                                await action(uid);
                                router.refresh();
                                handleClose(true);
                            }}
                        >
                            Yes
                        </Button>
                        <AlertDialogCancel onClick={() => handleClose(false)}>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DynamicModal
                open={dynamicModalOpen}
                title="Add Member"
                body={`${name} has been successfully added to ${group} list.`}
                onClose={() => setDynamicModalOpen(false)}
            />
        </>
    );
};

export default AddMemberModal;
