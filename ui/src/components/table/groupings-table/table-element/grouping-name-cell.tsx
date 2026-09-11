import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

const GroupingNameCell = ({ path, name, fromAdmin = false }: { path: string; name: string; fromAdmin?: boolean }) => {
    const source = fromAdmin ? '?from=admin' : '';

    return (
        <div className="m-2 w-full">
            <Link href={`/groupings/${path}/all-members${source}`}>
                <div className="flex">
                    <FontAwesomeIcon className="text-text-primary" data-testid={'edit-icon'} icon={faEdit} />
                    <div className="pl-2">{name}</div>
                </div>
            </Link>
        </div>
    );
};

export default GroupingNameCell;
