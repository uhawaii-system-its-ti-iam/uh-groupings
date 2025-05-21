import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Trash2Icon } from 'lucide-react';
import { MemberResult } from '@/lib/types';
import { useRouter } from 'next/navigation';

const RemoveMemberModal = ({
    uid,
    name,
    uhUuid,
    group,
    action
}: {
    uid: MemberResult;
    name: MemberResult;
    uhUuid: MemberResult;
    group: string;
    action: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Trash2Icon
                    data-testid="remove-member-icon"
                    className="h-4 w-4 text-red-600"
                    onClick={() => setOpen(true)}
                />
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[1.4rem] text-text-color">Remove Member</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to remove the following member from the <span>{group}</span> list.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid grid-cols-2">
                    <div className="grid">
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label className="font-bold text-s text-left whitespace-nowrap">NAME:</Label>
                        </div>
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label className="font-bold text-s text-left whitespace-nowrap">UH NUMBER:</Label>
                        </div>
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label className="font-bold text-s text-left whitespace-nowrap">UH USERNAME:</Label>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="grid grid-cols-3 items-center">
                            <Label className="text-s text-left whitespace-nowrap">{name}</Label>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                            <Label className="text-s text-left whitespace-nowrap">{uhUuid}</Label>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                            <Label className="text-s text-left whitespace-nowrap">{uid}</Label>
                        </div>
                    </div>
                </div>
                <AlertDialogDescription>
                    Are you sure you want to remove <span className="font-bold text-text-color">{name}</span> from the{' '}
                    <span>{group}</span> list?
                </AlertDialogDescription>
                <div className="px-3">
                    <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                        <AlertDescription>
                            Membership changes made may not take effect immediately. Usually, 3-5 minutes should be
                            anticipated. In extreme cases changes may take several hours to be fully processed,
                            depending on the number of members and the synchronization destination.
                        </AlertDescription>
                    </Alert>
                </div>
                <AlertDialogFooter>
                    <Button
                        onClick={() => {
                            action(uid);
                            router.refresh();
                            setOpen(false);
                        }}
                    >
                        Yes
                    </Button>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveMemberModal;
