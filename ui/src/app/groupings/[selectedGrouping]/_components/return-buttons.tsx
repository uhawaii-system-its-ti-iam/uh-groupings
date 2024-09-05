'use client';

import {useState} from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReturnButtons = () => {

    const [fromManageSubject, setFromManageSubject] = useState(false);

    const returnToGroupingsList = () => {};
    const returnToManageSubject = () => {};
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
