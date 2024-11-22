'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter
} from '@/components/ui/alert-dialog';
import { GroupingGroupMember } from '@/lib/types';
import { Button } from '@/components/ui/button';

const OwnersModal = ({
    open,
    onClose,
    modalData
}: {
    open: boolean;
    onClose: () => void;
    modalData: GroupingGroupMember[];
}) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Owners</AlertDialogTitle>
                    <AlertDialogDescription className="relative max-h-[13rem] overflow-scroll">
                        <div className="flex">
                            <div className="pe-5">
                                <b className="text-s">Username</b>
                                {modalData.map((member) => (
                                    <div key={member.uid} className="py-1">
                                        {member.uid}
                                    </div>
                                ))}
                            </div>
                            <div className="px-5">
                                <b className="text-s">UH Number</b>
                                {modalData.map((member) => (
                                    <div key={member.uid} className="py-1">
                                        {member.uhUuid}
                                    </div>
                                ))}
                            </div>
                            <div className="ps-5">
                                <b className="text-s">Name</b>
                                {modalData.map((member) => (
                                    <div key={member.uid} className="py-1">
                                        {member.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button onClick={onClose}>Ok</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OwnersModal;
