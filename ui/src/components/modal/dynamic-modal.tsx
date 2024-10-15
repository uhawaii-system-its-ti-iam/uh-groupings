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
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';

const DynamicModal = ({
    open,
    title,
    body,
    buttons
}: {
    open: boolean;
    title: string;
    body: string;
    buttons?: ReactNode[];
}) => {
    const [openDynamicModal, setOpenDynamicModal] = useState(open);

    /**
     * Closes the modal.
     */
    const close = () => {
        setOpenDynamicModal(false);
    };

    return (
        <AlertDialog open={openDynamicModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{body}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => close()}>OK</AlertDialogCancel>
                    {/*Any buttons that should lead the user to a different page.*/}
                    {buttons?.map((button, index) => (
                        <Button key={index} onClick={() => close()}>
                            {button}
                        </Button>
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DynamicModal;
