import { Skeleton } from '@/components/ui/skeleton';

const GroupingMemberIsBasisCell = ({ whereListed, isPending }: { whereListed: string; isPending?: boolean }) => {
    return <>{!isPending ? <i>{whereListed === 'Basis' ? 'Yes' : 'No'}</i> : <Skeleton className="h-5 w-7" />}</>;
};

export default GroupingMemberIsBasisCell;
