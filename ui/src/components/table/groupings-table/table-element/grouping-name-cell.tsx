import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

const GroupingNameCell = ({ path, name }: { path: string; name: string }) => {
    return (
        <div className="m-2 w-full'">
            <Link href={`/groupings/${path}`}>
                <div className="flex">
                    <FontAwesomeIcon className="text-text-primary" data-testid={'edit-icon'} icon={faEdit} />
                    <div className="pl-2">{name}</div>
                </div>
            </Link>
        </div>
    );
};

export default GroupingNameCell;
