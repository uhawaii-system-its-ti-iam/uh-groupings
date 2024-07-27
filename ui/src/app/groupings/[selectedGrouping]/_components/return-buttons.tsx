import {useState, useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const ReturnButtons = () => {

    const [fromManageSubject, setFromManageSubject] = useState(false);

    /*
    //Check current page
    const router = useRouter();
    const checkCurrentPage = () => {
        if (router.pathname.includes('/manage-subject')) {
            setFromManageSubject(true);
        } else if (router.pathname.includes('/manage-groupings')) {
            setFromManageSubject(false);
        }
    };

    useEffect(() => {
        checkCurrentPage();
    }, [router.pathname]);
    */


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
