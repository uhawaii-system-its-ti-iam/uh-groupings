'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReturnButtons = () => {
    const router = useRouter();
    const [fromManageSubject, setFromManageSubject] = useState(false);

    useEffect(() => {
        const fromPage = sessionStorage.getItem('fromPage');
        if (fromPage === 'manage-person') {
            setFromManageSubject(true);
        }
    }, []);

    const returnToGroupingsList = () => {
        router.push('/groupings');
    };

    const returnToManageSubject = () => {
        router.push('/manage-person');
    };

    const cancelDescriptionEdit = () => {};
    const toggleShowAdminTab = () => {};

    return (
        <>
            {!fromManageSubject ? (
                <Button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => {
                        returnToGroupingsList();
                        cancelDescriptionEdit();
                        toggleShowAdminTab();
                    }}>
                    <ArrowLeft className="mr-1" /> Return to Groupings List
                </Button>
            ) : (
                <Button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => {
                        returnToManageSubject();
                        cancelDescriptionEdit();
                        toggleShowAdminTab();
                    }}>
                    <ArrowLeft className="mr-1" /> Return to Manage Person
                </Button>
            )}
        </>
    );
};

export default ReturnButtons;
