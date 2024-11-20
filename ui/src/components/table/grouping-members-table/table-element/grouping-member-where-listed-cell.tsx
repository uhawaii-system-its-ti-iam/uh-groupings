import { Skeleton } from '@/components/ui/skeleton';

const GroupingMemberWhereListedCell = ({ whereListed, isPending }: { whereListed: string; isPending?: boolean }) => {
    return <>{!isPending ? whereListed : <Skeleton className="h-5 w-28" />}</>;
};

export default GroupingMemberWhereListedCell;
