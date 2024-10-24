'use client';

import { useState } from 'react';
import ApiErrorModal from '@/components/modal/api-error-modal';

interface ErrorProps {
    reset: () => void;
}

const Error = ({ reset }: ErrorProps) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    return (
        <div className={'min-h-screen'}>
            {open && (
                <ApiErrorModal
                    open={open}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default Error;
