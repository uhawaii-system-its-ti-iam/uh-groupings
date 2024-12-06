'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
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
    buttons,
    onClose
}: {
    open: boolean;
    title: string;
    body: string;
    buttons?: ReactNode[];
    onClose: () => void;
}) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{body}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>OK</AlertDialogCancel>
                    {/*Any buttons that should lead the user to a different page.*/}
                    {buttons?.map((button, index) => (
                        <Button key={index} onClick={onClose}>
                            {button}
                        </Button>
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DynamicModal;
