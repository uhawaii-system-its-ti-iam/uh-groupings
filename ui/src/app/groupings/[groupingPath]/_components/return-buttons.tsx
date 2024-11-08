'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ReturnButtons = ({ fromManageSubject }: { fromManageSubject: boolean }) => {
    return (
        <>
            {!fromManageSubject ? (
                <Link href="/groupings">
                    <Button className="btn btn-primary" type="button">
                        <FontAwesomeIcon className="mr-1" icon={faArrowLeft} /> Return to Groupings List
                    </Button>
                </Link>
            ) : (
                <Link href="/manage-person">
                    <Button className="btn btn-primary" type="button">
                        <FontAwesomeIcon className="mr-1" icon={faArrowLeft} /> Return to Manage Person
                    </Button>
                </Link>
            )}
        </>
    );
};

export default ReturnButtons;
