'use client';

import { useEffect, useState } from 'react';
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
import { useIdleTimer } from 'react-idle-timer';
import { logout } from '@/access/authentication';
import User from '@/access/user';
import Role from '@/access/role';

const timeout = 1000 * 60 * 30; // Total timeout - 30 minutes in milliseconds
const promptBeforeIdle = 1000 * 60 * 5; // Time prior to timeout until modal opens - 5 minutes in milliseconds

const TimeoutModal = ({
    currentUser
}: {
    currentUser: User
}) => {
    const [open, setOpen] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(timeout);

    const { activate,  getRemainingTime } = useIdleTimer({
        onIdle: () => logout(),
        onPrompt: () => setOpen(true),
        timeout,
        promptBeforeIdle,
        throttle: 500,
        disabled: !currentUser.roles.includes(Role.UH)
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(getRemainingTime());
        }, 500);
    
        return () => {
            clearInterval(interval);
        };
    });

    /**
     * Closes the modal and resets the timer.
     */
    const close = () => {
        activate(); 
        setOpen(false);
    };

    /**
     * Convert miliseconds into mm:ss string format.
     * 
     * @param ms - the number of milliseconds
     * 
     * @returns the mm:ss formatted string
     */
    const formatTime = (ms: number) => {
        const date = new Date(ms);
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return ( 
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Inactivity Warning</AlertDialogTitle>
                    <AlertDialogDescription>
                        Warning! This session will expire soon. 
                        Time remaining: 
                        <span className="text-text-color"> {formatTime(remainingTime)}.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => close()}>Stay logged in</AlertDialogCancel>
                    <AlertDialogAction onClick={() => logout()}>Log off now</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
 
export default TimeoutModal;
