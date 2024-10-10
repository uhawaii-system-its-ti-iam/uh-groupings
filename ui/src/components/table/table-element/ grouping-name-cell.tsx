import Link from 'next/link';
import { SquarePen } from 'lucide-react';

const GroupingNameCell = ({ path, name }: { path: string; name: string }) => {
    return (
        <div className="m-2 'w-full'">
            <Link href={`/groupings/${path}`}>
                <div className="flex">
                    <SquarePen size="1.25em" className="text-text-primary" data-testid={'square-pen-icon'} />
                    <div className="pl-2">{name}</div>
                </div>
            </Link>
        </div>
    );
};

export default GroupingNameCell;
