'use client';

import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import User from '@/lib/access/user';
import { logout } from 'next-cas-client';
import Role from '@/lib/access/role';
import DynamicModal from '@/components/modal/dynamic-modal';

const timeout = 1000 * 60 * 30; // Total timeout - 30 minutes in milliseconds
const promptBeforeIdle = 1000 * 60 * 5; // Time prior to timeout until modal opens - 5 minutes in milliseconds

const TimeoutModal = ({ currentUser }: { currentUser: User }) => {
    const [open, setOpen] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number>(timeout);

    const { activate, getRemainingTime } = useIdleTimer({
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
        <DynamicModal
            open={open}
            title="Inactivity Warning"
            body={`Warning! This session will expire soon. Time remaining: ${formatTime(remainingTime)}.`}
            onClose={close}
            buttons={[
                <span key="stay" onClick={close}>Stay logged in</span>,
                <span key="logout" onClick={() => logout()}>Log off now</span>,
            ]}
        />
    );
};

export default TimeoutModal;
