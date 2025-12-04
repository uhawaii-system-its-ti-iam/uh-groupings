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
import GroupingMemberUidCell
    from '@/app/groupings/[groupingPath]/@tab/_components/grouping-members-table/table-element/grouping-member-uid-cell';

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
                    <AlertDialogDescription />
                </AlertDialogHeader>
                <div className="relative max-h-[13rem] overflow-scroll">
                    <div className="flex ml-10 mt-0">
                        <div className="pe-5">
                            <b className="text-s">Username</b>
                            {modalData.map((member) => (
                                <div key={member.uid} className="py-1">
                                    <GroupingMemberUidCell uid={member.uid} />
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
                </div>
                <AlertDialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OwnersModal;
