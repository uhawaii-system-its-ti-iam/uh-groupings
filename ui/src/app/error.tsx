'use client';
import { useState, useEffect } from 'react';
import ApiErrorModal from '@/components/modal/api-error-modal';

export default function Error({
    error
}: {
    error: Error & { digest?: string } | null;
}) {
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        if (error) {
            setIsModalOpen(true);
        }
    }, [error]);

    console.log("Error component is being rendered");
    console.log("Modal open state:", isModalOpen);

    return (
        <html>
            <body>
                <ApiErrorModal open={ true } /> {/* Pass onClose handler */}
            </body>
        </html>
    );
}
