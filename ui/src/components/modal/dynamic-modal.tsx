'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
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
    body: string;
    warning?: string;
    buttons?: ReactNode[];
    closeText?: string;
    onClose: () => void;
}) => {
    return (
        <AlertDialog open={open}>
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
