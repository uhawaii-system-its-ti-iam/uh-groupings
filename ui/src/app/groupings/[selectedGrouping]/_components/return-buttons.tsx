import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReturnButtons = ({
                           fromManageSubject,
                           returnToGroupingsList,
                           returnToManageSubject,
                           cancelDescriptionEdit,
                           toggleShowAdminTab
                       }) => (
    <>
        {!fromManageSubject ? (
            <Button
                className="btn btn-primary"
                type="submit"
                onClick={() => {
                    returnToGroupingsList();
                    cancelDescriptionEdit();
                    toggleShowAdminTab();
                }}
            >
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
                }}
            >
                <ArrowLeft className="mr-1" /> Return to Manage Person
            </Button>
        )}
    </>
);

export default ReturnButtons;
