import { Skeleton } from '@/components/ui/skeleton';
import { WhereListed } from '@/lib/types';

const GroupingMemberIsBasisCell = ({ whereListed, isPending }: { whereListed: WhereListed; isPending?: boolean }) => {
    return <>{!isPending ? <i>{whereListed === 'Basis' ? 'Yes' : 'No'}</i> : <Skeleton className="h-5 w-7" />}</>;
};

export default GroupingMemberIsBasisCell;
