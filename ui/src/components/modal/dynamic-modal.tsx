'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const DynamicModal = ({
    open,
    title,
    body,
    warning,
    buttons,
    closeText = 'Cancel',
    onClose,
}: {
    open: boolean;
    title: string;
    body: string | ReactNode;
    warning?: string;
    buttons?: ReactNode[];
    closeText?: string;
    onClose: () => void;
}) => {
    return (
        <AlertDialog open={open} className="max-w-[90vw] sm:max-w-[500px] max-h-[80vh]">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{body}</AlertDialogDescription>
                    {warning && (
                        <AlertDialogDescription>
                            <div className="bg-yellow-100 border border-yellow-200 p-3 rounded-md ml-2.5">
                                {warning}
                            </div>
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {buttons?.map((button, index) => (
                        <Button
                            key={index}
                            onClick={onClose}
                            className="bg-uh-teal text-white hover:bg-uh-teal/90"
                        >
                            {button}
                        </Button>
                    ))}
                    <AlertDialogCancel onClick={onClose}>{closeText}</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DynamicModal;
