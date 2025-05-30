'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useState } from 'react';

const ApiErrorModal = ({
    open,
    onClose
    }: {
    open: boolean;
    onClose?: () => void;
}) => {
    const [openApiErrorModal, setOpenApiErrorModal] = useState(open);

    const close = () => {
        setOpenApiErrorModal(false);
        if (onClose) {
            onClose();
        }
    };
    return (
        <AlertDialog open={openApiErrorModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Error</AlertDialogTitle>
                    <AlertDialogDescription>
                        There was an unexpected communications problem. Please refresh the page and try again.
                        <br />
                        <br />
                        If the error persists please refer to our
                        <Link className="text-text-color" href={'/feedback'} onClick={() => close()}>
                            {' '}
                            feedback page.
                        </Link>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={close}>OK</AlertDialogCancel>
                    <Link href={'/feedback'}>
                        <AlertDialogAction onClick={close}>Feedback</AlertDialogAction>
                    </Link>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ApiErrorModal;
