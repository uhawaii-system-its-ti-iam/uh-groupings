'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
                    <FontAwesomeIcon className="mr-1" icon={faArrowLeft} /> Return to Groupings List
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
                    <FontAwesomeIcon className="mr-1" icon={faArrowLeft} /> Return to Manage Person
                </Button>
            )}
        </>
    );
};

export default ReturnButtons;
