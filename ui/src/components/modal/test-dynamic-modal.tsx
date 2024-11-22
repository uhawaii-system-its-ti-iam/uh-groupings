'use client';

import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter
} from '@/components/ui/alert-dialog';

const TestDynamicModal = ({
    open,
    title,
    description,
    children,
    buttons
}: {
    open: boolean;
    title: string;
    description: React.ReactNode | string;
    children: React.ReactNode | string;
    buttons: React.ReactNode;
}) => {
    return (
        <AlertDialog open={open} className="max-w-[90vw] sm:max-w-[500px] max-h-[80vh]">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description.props.children && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>{buttons}</AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TestDynamicModal;
