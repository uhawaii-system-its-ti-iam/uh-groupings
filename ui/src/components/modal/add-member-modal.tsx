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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Group } from '@/lib/types';
import { message } from '@/lib/messages';

const AddMemberModal = ({
    open,
    uid,
    name,
    uhUuid,
    group,
    onConfirm,
    onClose,
}: {
    open: boolean;
    uid: string;
    name: string;
    uhUuid: string;
    group: Group;
    onConfirm: () => void;
    onClose: () => void;
}) => {
    return (
        <>
            <AlertDialog open={open} onOpenChange={onClose}>
                <AlertDialogContent
                    data-testid="add-member-modal"
                    className="sm:max-w-[500px]"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[1.4rem] text-text-color">
                            Add Member
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to add the following member to the{' '}
                            <span>{group}</span> list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid grid-cols-2">
                        <div className="grid">
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">
                                    NAME:
                                </Label>
                            </div>
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">
                                    UH NUMBER:
                                </Label>
                            </div>
                            <div className="grid grid-cols-3 items-center py-1 px-4">
                                <Label className="font-bold text-s text-left whitespace-nowrap">
                                    UH USERNAME:
                                </Label>
                            </div>
                        </div>

                        <div className="grid">
                            <div className="grid grid-cols-3 items-center">
                                <Label className="text-s text-left whitespace-nowrap">
                                    {name}
                                </Label>
                            </div>
                            <div className="grid grid-cols-4 items-center">
                                <Label className="text-s text-left whitespace-nowrap">
                                    {uhUuid}
                                </Label>
                            </div>
                            <div className="grid grid-cols-4 items-center">
                                <Label className="text-s text-left whitespace-nowrap">
                                    {uid}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <AlertDialogDescription>
                        Are you sure you want to add{' '}
                        <span className="font-bold text-text-color">
                            {name}
                        </span>{' '}
                        to the <span>{group}</span> list?
                    </AlertDialogDescription>

                    <div className="px-3">
                        <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                            <AlertDescription>
                                {message.RemoveMemberModals.ALERT_DESCRIPTION}
                            </AlertDescription>
                        </Alert>
                    </div>

                    <AlertDialogFooter>
                        <Button onClick={onConfirm}>Yes</Button>
                        <AlertDialogCancel
                            data-testid="modal-close-button"
                        >
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AddMemberModal;
