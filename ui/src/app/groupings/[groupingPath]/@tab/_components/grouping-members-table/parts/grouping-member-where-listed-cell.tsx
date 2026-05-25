import { Skeleton } from '@/components/ui/skeleton';
import { WhereListed } from '@/lib/types';

const GroupingMemberWhereListedCell = ({
    whereListed,
    isPending
}: {
    whereListed: WhereListed;
    isPending?: boolean;
}) => {
    return <>{!isPending ? whereListed : <Skeleton className="h-5 w-28" />}</>;
};

export default GroupingMemberWhereListedCell;
